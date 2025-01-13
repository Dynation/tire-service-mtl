import { NextRequest, NextResponse } from "next/server";
import { verifyServerToken } from "../../lib/firebaseAdmin"; // Імпорт функції верифікації
import db from "../../lib/db"; // Prisma клієнт

// Функція для перевірки автентифікації користувача
async function getAuthenticatedUser(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Not authenticated");
  }
  const token = authHeader.split("Bearer ")[1];
  const decodedToken = await verifyServerToken(token);
  if (!decodedToken) {
    throw new Error("Invalid token");
  }
  return decodedToken.uid;
}

// GET: Отримання записів для користувача
export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUser(req);

    const url = new URL(req.url);
    const userQuery = url.searchParams.get("userId");

    if (userId !== userQuery) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const appointments = await db.appointment.findMany({
      where: { userId },
      include: {
        vehicle: true, // Повертаємо інформацію про транспортний засіб
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch appointments" },
      { status: error instanceof Error && error.message === "Not authenticated" ? 401 : 500 }
    );
  }
}

// POST: Створення нового запису
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUser(req);
    const data = await req.json();

    const {
      licensePlate,
      dateTime,
      type,
      notes,
      tireSize,
      wheelCount,
      flatRun,
      lowProfile,
    } = data;

    if (!licensePlate || !dateTime || !type || !tireSize || !wheelCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAppointment = await db.appointment.create({
      data: {
        userId,
        licensePlate,
        dateTime: new Date(dateTime),
        type,
        status: "PENDING", // За замовчуванням статус PENDING
        notes: notes || null,
        tireSize,
        wheelCount,
        flatRun,
        lowProfile,
      },
    });

    console.log("Appointment created:", newAppointment);
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("Failed to create appointment:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create appointment" },
      { status: 500 }
    );
  }
}

// DELETE: Видалення запису
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUser(req);

    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("id");

    if (!appointmentId) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
    }

    const appointment = await db.appointment.findFirst({
      where: { id: parseInt(appointmentId), userId },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found or unauthorized" }, { status: 404 });
    }

    await db.appointment.delete({
      where: { id: parseInt(appointmentId) },
    });

    console.log("Appointment deleted:", appointmentId);
    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Failed to delete appointment:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
