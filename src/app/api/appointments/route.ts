// src/app/api/appointments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const appointments = await prisma.appointment.findMany({
      select: {
        id: true,
        userId: true,
        vehicleId: true,
        dateTime: true,
        type: true,
        status: true,
        notes: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // Окремий запит для отримання даних про транспортні засоби
    const vehicles = await prisma.vehicle.findMany();

    // Об'єднуємо дані про записи та транспортні засоби
    const formattedAppointments = appointments.map((appt) => {
      const vehicle = vehicles.find((v) => v.id === appt.vehicleId);

      return {
        date: appt.dateTime.toISOString().split("T")[0],
        time: new Date(appt.dateTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        serviceType: appt.type,
        vehicleType: vehicle ? vehicle.vehicleType : "UNKNOWN",
        notes: appt.notes,
        userName: appt.user.name,
      };
    });

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
