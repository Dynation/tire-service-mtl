//appointments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyServerToken } from "../../lib/firebaseAdmin"; // Імпорт функції верифікації
import sanitizeHtml from "sanitize-html";
import db from "../../lib/db"; // Prisma клієнт
import { ServiceType } from "@prisma/client";


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
    // Отримуємо автентифікованого користувача
    const userId = await getAuthenticatedUser(req);
    if (!userId) {
      throw new Error("Authentication required");
    }

    // Парсимо дані із запиту
    const { licensePlate, dateTime, type, notes } = await req.json();

    // Валідація вхідних даних
    if (!licensePlate || !dateTime || !type) {
      return NextResponse.json(
        { error: "Missing required fields: licensePlate, dateTime, or type" },
        { status: 400 }
      );
    }

    // Перевіряємо, чи тип є допустимим
    if (!Object.values(ServiceType).includes(type as ServiceType)) {
      return NextResponse.json(
        { error: `Invalid service type: ${type}` },
        { status: 400 }
      );
    }

    // Перевірка, чи запис вже існує
    const existingAppointment = await db.appointment.findFirst({
      where: {
        userId,
        licensePlate,
        dateTime: new Date(dateTime),
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: "Appointment already exists for this time and vehicle" },
        { status: 409 }
      );
    }

    // Санітизуємо нотатки
    const sanitizedNotes = sanitizeHtml(notes || "", {
      allowedTags: [],
      allowedAttributes: {},
    });

    // Створюємо запис
    const newAppointment = await db.appointment.create({
      data: {
        userId,
        licensePlate,
        dateTime: new Date(dateTime),
        type: type as ServiceType,
        status: "PENDING",
        notes: sanitizedNotes || null,
        cancelledByAdmin: false,
      },
    });

    // Лог успішного створення
    console.log("Appointment created:", newAppointment);

    // Повертаємо відповідь
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("Failed to create appointment:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
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

    // Позначення запису як скасованого, а не видалення
    const updatedAppointment = await db.appointment.update({
      where: { id: parseInt(appointmentId) },
      data: {
        status: "CANCELLED",
      },
    });

    console.log("Appointment cancelled:", updatedAppointment);
    return NextResponse.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Failed to cancel appointment:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to cancel appointment" },
      { status: 500 }
    );
  }
}
