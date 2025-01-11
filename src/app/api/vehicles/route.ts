// src/app/api/vehicles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyServerToken } from "../../lib/firebaseAdmin"// імпорт
import db from "../../../app/lib/db";
import { logRequest } from "../../lib/apiUtils";
async function getAuthenticatedSession(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Not authenticated");
  }
  const token = authHeader.split("Bearer ")[1];
  const decodedToken = await verifyServerToken(token); // Використовується verifyServerToken
  if (!decodedToken) {
    throw new Error("Invalid token");
  }
  return decodedToken;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthenticatedSession(req);
    const vehicles = await db.vehicle.findMany({
      where: { userId: session.uid },
    });
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch vehicles" },
      { status: error instanceof Error && error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}

// Функція для обробки помилок
function handleError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "Not authenticated") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
}
// POST: Додавання нового транспортного засобу
export async function POST(req: NextRequest) {
  logRequest(req);

  try {
    const session = await getAuthenticatedSession(req);
    const data = await req.json();
    const { licensePlate, model, vehicleType } = data;

    if (!licensePlate || !model || !vehicleType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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

    console.log("Vehicle added successfully:", newVehicle);
    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error("Failed to add vehicle:", error);
    return handleError(error);
  }
}

// DELETE: Видалення транспортного засобу
export async function DELETE(req: NextRequest) {
  logRequest(req);

  try {
    const session = await getAuthenticatedSession(req);
    const { searchParams } = new URL(req.url);
    const licensePlate = searchParams.get("licensePlate");

    if (!licensePlate) {
      return NextResponse.json({ error: "License plate is required" }, { status: 400 });
    }

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

    const vehicle = await db.vehicle.findFirst({
      where: { 
        licensePlate,
        userId: session.uid
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found or unauthorized" }, { status: 404 });
    }

    await db.vehicle.delete({
      where: { licensePlate },
    });

    console.log("Vehicle deleted successfully:", licensePlate);
    return NextResponse.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Failed to delete vehicle:", error);
    return handleError(error);
  }
}
