import { NextRequest, NextResponse } from "next/server";
import db from "../../../app/lib/db";
import admin from "../../lib/firebaseAdmin"; // Використовуємо для перевірки токена

// Функція для перевірки автентифікації
async function getAuthenticatedSession(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Authorization header is missing or invalid");
    throw new Error("Not authenticated");
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded Token:", decodedToken);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || "User",
    };
  } catch (error) {
    console.error("Failed to verify token:", error);
    throw new Error("Not authenticated");
  }
}

// GET: Отримання списку транспортних засобів
export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedSession(req);

    const vehicles = await db.vehicle.findMany({
      where: { userId: session.uid },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Failed to fetch vehicles:", error);
    return handleError(error);
  }
}

// POST: Додавання нового транспортного засобу
export async function POST(req: NextRequest) {
  try {
    const session = await getAuthenticatedSession(req);
    const data = await req.json();
    const { licensePlate, model, vehicleType } = data;

    // Перевірка ліміту транспортних засобів
    const vehicleCount = await db.vehicle.count({
      where: { userId: session.uid },
    });

    if (vehicleCount >= 5) {
      return NextResponse.json({ error: "Vehicle limit reached (5 vehicles max)" }, { status: 400 });
    }

    const newVehicle = await db.vehicle.create({
      data: {
        licensePlate,
        model,
        vehicleType,
        userId: session.uid,
      },
    });

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error("Failed to add vehicle:", error);
    return handleError(error);
  }
}

// DELETE: Видалення транспортного засобу
export async function DELETE(req: NextRequest) {
  try {
    const session = await getAuthenticatedSession(req);
    const { searchParams } = new URL(req.url);
    const licensePlate = searchParams.get("licensePlate");

    if (!licensePlate) {
      return NextResponse.json({ error: "License plate is required" }, { status: 400 });
    }

    // Перевірка наявності активних записів
    const hasActiveAppointments = await db.appointment.findFirst({
      where: {
        licensePlate,
        userId: session.uid,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (hasActiveAppointments) {
      return NextResponse.json(
        { error: "Cannot delete vehicle with active appointments" },
        { status: 400 }
      );
    }

    await db.vehicle.delete({
      where: { licensePlate },
    });

    return NextResponse.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Failed to delete vehicle:", error);
    return handleError(error);
  }
}

// Універсальна функція для обробки помилок
function handleError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "Not authenticated") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
}
