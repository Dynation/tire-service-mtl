import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyServerToken } from "../../lib/firebaseAdmin";
import sanitizeHtml from "sanitize-html";
import db from "../../lib/db"; // Prisma клієнт
import { ServiceType } from "@prisma/client";

async function getAuthenticatedUser() {
  const token = (await cookies()).get("authToken")?.value;
  if (!token) {
    throw new Error("Not authenticated");
  }

  const decodedToken = await verifyServerToken(token);
  if (!decodedToken) {
    throw new Error("Invalid token");
  }
  return decodedToken.uid;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUser();
    
    const appointments = await db.appointment.findMany({
      where: { userId },
      include: { vehicle: true },
      orderBy: { dateTime: "asc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 401 });
  }
}


// 🔹 POST: Створення нового запису
export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { licensePlate, dateTime, type, notes } = await req.json();

    if (!licensePlate || !dateTime || !type || !(type in ServiceType)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const existingAppointment = await db.appointment.findFirst({
      where: { userId, licensePlate, dateTime: new Date(dateTime) },
    });

    if (existingAppointment) {
      return NextResponse.json({ error: "Appointment already exists" }, { status: 409 });
    }

    const newAppointment = await db.appointment.create({
      data: {
        userId,
        licensePlate,
        dateTime: new Date(dateTime),
        type: type as ServiceType,
        status: "PENDING",
        notes: sanitizeHtml(notes || ""),
        cancelledByAdmin: false,
      },
    });

    console.log("Appointment created:", newAppointment);
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("Failed to create appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 🔹 DELETE: Видалення запису
export async function DELETE(req: NextRequest) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("id");
    if (!appointmentId) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const appointment = await db.appointment.findFirst({
      where: { id: parseInt(appointmentId), userId },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    const updatedAppointment = await db.appointment.update({
      where: { id: parseInt(appointmentId) },
      data: { status: "CANCELLED" },
    });

    console.log("Appointment cancelled:", updatedAppointment);
    return NextResponse.json({ message: "Appointment cancelled" });
  } catch (error) {
    console.error("Failed to cancel appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
