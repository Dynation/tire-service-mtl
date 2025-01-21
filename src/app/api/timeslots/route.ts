import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const vehicleType = searchParams.get("vehicleType");

  if (!date || !vehicleType) {
    return NextResponse.json({ error: "Date and vehicleType are required." }, { status: 400 });
  }

  const duration = getDuration(vehicleType);
  const startTime = new Date(`${date}T07:00:00`);
  const endTime = new Date(`${date}T15:15:00`);

  const allSlots: string[] = [];
  for (let time = startTime; time < endTime; time = new Date(time.getTime() + 15 * 60 * 1000)) {
    allSlots.push(time.toISOString());
  }

  // Fetch existing appointments for the day
  const existingAppointments = await prisma.appointment.findMany({
    where: { dateTime: { gte: startTime, lt: endTime } },
  });

  const blockedSlots = new Set();
  interface Appointment {
    dateTime: Date;
  }

  existingAppointments.forEach((appointment: Appointment) => {
    let time: Date = new Date(appointment.dateTime);
    for (let i = 0; i < duration / 15; i++) {
      blockedSlots.add(time.toISOString());
      time = new Date(time.getTime() + 15 * 60 * 1000);
    }
  });

  const availableSlots = allSlots.filter((slot) => !blockedSlots.has(slot));
  return NextResponse.json({ availableSlots }, { status: 200 });
}
function getDuration(vehicleType: string): number {
  switch (vehicleType) {
    case "SMALL_CAR":
      return 45;
    case "SUV":
      return 60;
    case "TRUCK":
      return 75;
    default:
      return 45;
  }
}
