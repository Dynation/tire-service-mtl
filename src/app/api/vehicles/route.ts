import { NextRequest, NextResponse } from "next/server";
import db from "../../../app/lib/db";
import { getSession } from "../../../app/lib/firebaseAuth";

// Функція для отримання сесії та перевірки автентифікації
async function getAuthenticatedSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return session;
}

// Функція для логування запитів
function logRequest(req: NextRequest) {
  console.log("Request received:", {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers),
  });
}

// GET: Отримання списку транспортних засобів користувача
export async function GET(req: NextRequest) {
  logRequest(req);

  try {
    const session = await getAuthenticatedSession();

    const vehicles = await db.vehicle.findMany({
      where: { userId: session.uid },
    });

    console.log("Vehicles fetched successfully:", vehicles);
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Failed to fetch vehicles:", (error as Error).message);
    if ((error as Error).message === "Not authenticated") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

// POST: Додавання нового транспортного засобу
export async function POST(req: NextRequest) {
  logRequest(req);

  try {
    const session = await getAuthenticatedSession();
    const data = await req.json();
    const { licensePlate, model, vehicleType } = data;

    if (!licensePlate || !model || !vehicleType) {
      console.error("Missing required fields:", { licensePlate, model, vehicleType });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Перевірка ліміту на 5 авто
    const vehicleCount = await db.vehicle.count({
      where: { userId: session.uid },
    });

    if (vehicleCount >= 5) {
      console.warn("Vehicle limit reached for user:", session.uid);
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

    console.log("Vehicle added successfully:", newVehicle);
    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error("Failed to add vehicle:", (error as Error).message);
    if ((error as Error).message === "Not authenticated") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to add vehicle" }, { status: 500 });
  }
}

// DELETE: Видалення транспортного засобу (якщо немає активних записів)
export async function DELETE(req: NextRequest) {
  logRequest(req);

  try {
    const session = await getAuthenticatedSession();
    const { searchParams } = new URL(req.url);
    const licensePlate = searchParams.get("licensePlate");

    if (!licensePlate) {
      console.error("License plate is required");
      return NextResponse.json({ error: "License plate is required" }, { status: 400 });
    }

    // Перевірка на активні записи
    const hasActiveAppointments = await db.appointment.findFirst({
      where: {
        licensePlate,
        userId: session.uid,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (hasActiveAppointments) {
      console.warn("Attempt to delete vehicle with active appointments:", licensePlate);
      return NextResponse.json(
        { error: "Cannot delete vehicle with active appointments" },
        { status: 400 }
      );
    }

    await db.vehicle.delete({
      where: { licensePlate },
    });

    console.log("Vehicle deleted successfully:", licensePlate);
    return NextResponse.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Failed to delete vehicle:", (error as Error).message);
    if ((error as Error).message === "Not authenticated") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
  }
}
