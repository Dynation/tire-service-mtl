// src/app/api/timeslots/route.ts
import { NextResponse } from "next/server";
import { addMinutes, parseISO, formatISO } from "date-fns";
import prisma from "../../lib/db";

const VEHICLE_SLOTS: Record<string, number> = {
  SMALL_CAR: 3, // 45 хв = 3 слоти по 15 хв
  SUV: 4,       // 60 хв = 4 слоти по 15 хв
  TRUCK: 5,     // 75 хв = 5 слотів по 15 хв
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date")?.trim();

    if (!date) {
      return NextResponse.json({ error: "Date is required." }, { status: 400 });
    }

    const startDate = parseISO(`${date}T07:00:00`);
    const endDate = parseISO(`${date}T15:45:00`);

    // Генеруємо всі 15-хвилинні слоти
    const allSlots = Array.from(
      { length: (endDate.getTime() - startDate.getTime()) / (15 * 60 * 1000) },
      (_, i) => formatISO(addMinutes(startDate, i * 15))
    );

    // Отримуємо підтверджені записи з бази
    const appointments = await prisma.appointment.findMany({
      where: {
        dateTime: { gte: startDate, lt: endDate },
        status: "CONFIRMED",
      },
      include: { vehicle: true },
    });

    const occupiedSlots = new Set<string>();

    // Проходимо по всіх записах і додаємо зайняті слоти у `occupiedSlots`
    appointments.forEach(({ dateTime, vehicle }) => {
      const durationSlots = VEHICLE_SLOTS[vehicle.vehicleType] || 3;
      let time = new Date(dateTime);

      for (let i = 0; i < durationSlots; i++) {
        occupiedSlots.add(formatISO(time));
        time = addMinutes(time, 15);
      }
    });
    console.log("API RESPONSE", occupiedSlots);
    return NextResponse.json({ occupiedSlots: Array.from(occupiedSlots) });
  } catch (error) {
    console.error("Error fetching timeslots:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
