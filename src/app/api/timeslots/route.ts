import { NextResponse } from "next/server";
import { addMinutes, parseISO, formatISO } from "date-fns";
import prisma from "../../lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date")?.trim();

    if (!date) {
      return NextResponse.json({ error: "Date is required." }, { status: 400 });
    }

    const startDate = parseISO(`${date}T07:00:00`);
    const endDate = parseISO(`${date}T15:45:00`);

    // Отримуємо підтверджені записи з бази
    const appointments = await prisma.appointment.findMany({
      where: {
        dateTime: { gte: startDate, lt: endDate },
        status: "CONFIRMED",
      },
      select: { dateTime: true, slotCount: true },
    });

    const occupiedSlots = new Set<string>();

    // Проходимо по всіх записах і додаємо зайняті слоти у `occupiedSlots`
    appointments.forEach(({ dateTime, slotCount }) => {
      let time = new Date(dateTime);

      for (let i = 0; i < slotCount; i++) {
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

