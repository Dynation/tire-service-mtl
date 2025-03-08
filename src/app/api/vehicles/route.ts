// src/app/api/vehicles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyServerToken } from "../../lib/firebaseAdmin"// імпорт
import db from "../../../app/lib/db";
import { logRequest } from "../../lib/apiUtils";

async function getAuthenticatedSession(_req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value; // ✅ Отримуємо токен із cookies

  if (!token) {
    throw new Error("Not authenticated");
  }

  const decodedToken = await verifyServerToken(token);
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
        // Приведення до коректних типів
        const {
          licensePlate,
          model,
          vehicleType,
          tireSize,
          wheelCount,
          flatRun,
          lowProfile,
        } = {
          ...data,
          wheelCount: parseInt(data.wheelCount, 10), // Перетворення wheelCount у число
        };
    console.log("Received data:", data);
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
        tireSize: tireSize || '',
        wheelCount: wheelCount || 4,
        flatRun: flatRun || false,
        lowProfile: lowProfile || false,
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
  logRequest(req); // Лог запиту

  try {
    const session = await getAuthenticatedSession(req);
    console.log("Authenticated session:", session);

    if (!session?.uid) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const licensePlate = searchParams.get("licensePlate");

    if (!licensePlate) {
      return NextResponse.json({ error: "License plate is required" }, { status: 400 });
    }

    // Перевіряємо, чи авто належить цьому юзеру
    const vehicle = await db.vehicle.findFirst({
      where: { 
        licensePlate,
        userId: session.uid,
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found or unauthorized" }, { status: 404 });
    }

    // Перевіряємо, чи є активні записи
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

    // Видаляємо авто
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

