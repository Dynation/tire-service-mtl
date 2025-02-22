import { NextResponse } from "next/server";
import { addMinutes, parseISO, formatISO } from "date-fns";
import prisma from "../../lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Date is required." }, { status: 400 });
    }

    // Парсимо дату та створюємо часовий діапазон
    const startDate = parseISO(`${date.trim()}T07:00:00`);
    const endDate = parseISO(`${date.trim()}T15:45:00`);

    // Генеруємо всі 15-хвилинні слоти
    const allSlots: string[] = [];
    for (let time = startDate; time < endDate; time = addMinutes(time, 15)) {
      allSlots.push(formatISO(time));
    }

    // Отримуємо підтверджені записи для дня
    const appointments = await prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: startDate,
          lt: endDate,
        },
        status: "CONFIRMED",
      },
      include: { vehicle: true },
    });

    // Якщо записів немає, повертаємо всі слоти як доступні
    if (!appointments || appointments.length === 0) {
      return NextResponse.json({
        slots: allSlots.map((slot) => ({
          time: slot,
          isOccupied: false,
        })),
      });
    }

    // Вираховуємо зайняті слоти
    const blockedSlots = new Set<string>();
    appointments.forEach((appointment) => {
      const duration = getDuration(appointment.vehicle.vehicleType);
      let time = new Date(appointment.dateTime);
      for (let i = 0; i < duration / 15; i++) {
        blockedSlots.add(formatISO(time));
        time = addMinutes(time, 15);
      }
    });

    // Маркуємо слоти як зайняті або вільні
    const slots = allSlots.map((slot) => ({
      time: slot,
      isOccupied: blockedSlots.has(slot),
    }));

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching daily occupancy:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// Допоміжна функція для визначення тривалості
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
