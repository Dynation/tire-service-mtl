import { NextResponse } from "next/server";
import { PrismaClient, ServiceType } from "@prisma/client";

const prisma = new PrismaClient();

// GET handler
export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      select: {
        id: true,
        userId: true,
        dateTime: true,
        type: true,
        status: true,
        notes: true,
        tireSize: true,
        wheelCount: true,
        flatRun: true,
        lowProfile: true,
        user: {
          select: {
            name: true,
          },
        },
        vehicle: {
          select: {
            vehicleType: true,
            model: true,
            licensePlate: true,
          },
        },
      },
    });

    const formattedAppointments = appointments.map((appt) => ({
      id: appt.id,
      date: appt.dateTime.toISOString().split("T")[0],
      time: new Date(appt.dateTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      serviceType: appt.type,
      status: appt.status,
      vehicleType: appt.vehicle?.vehicleType || "Unknown",
      tireSize: appt.tireSize,
      wheelCount: appt.wheelCount,
      flatRun: appt.flatRun,
      lowProfile: appt.lowProfile,
      notes: appt.notes || "",
      userName: appt.user?.name || "Unknown",
      vehicleModel: appt.vehicle?.model || "Unknown",
      plateNumber: appt.vehicle?.licensePlate || "Unknown",
    }));

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST handler
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      userId,
      licensePlate,
      model,
      vehicleType,
      dateTime,
      type,
      tireSize,
      wheelCount,
      flatRun,
      lowProfile,
      notes,
    } = data;

    // Перевірка на обов'язкові поля
    if (!userId || !licensePlate || !model || !vehicleType || !dateTime || !type) {
      console.error("Missing required appointment data:", {
        userId,
        licensePlate,
        model,
        vehicleType,
        dateTime,
        type,
      });
      return NextResponse.json(
        { error: "Missing required fields for creating appointment" },
        { status: 400 }
      );
    }

    // Валідація дати
    const parsedDateTime = new Date(dateTime);
    if (isNaN(parsedDateTime.getTime())) {
      console.error("Invalid dateTime format:", dateTime);
      return NextResponse.json(
        { error: "Invalid dateTime format" },
        { status: 400 }
      );
    }

    // Створення або оновлення транспортного засобу
    await prisma.vehicle.upsert({
      where: { licensePlate },
      update: {
        model,
        vehicleType,
      },
      create: {
        licensePlate,
        userId,
        model,
        vehicleType,
      },
    });

    console.log("Creating appointment with data:", {
      userId,
      licensePlate,
      dateTime: parsedDateTime,
      type,
      status: "PENDING",
      tireSize,
      wheelCount,
      flatRun,
      lowProfile,
      notes,
    });

    // Створення запису Appointment
    const newAppointment = await prisma.appointment.create({
      data: {
        userId,
        licensePlate,
        dateTime: parsedDateTime,
        type: type as ServiceType,
        status: "PENDING",
        tireSize,
        wheelCount,
        flatRun,
        lowProfile,
        notes,
      },
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
