// New API for fetching daily occupancy
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { formatISO, parseISO, addMinutes } from "date-fns";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Date is required." });
  }

  try {
    // Parse date and set time range for the day
    const startDate = parseISO(`${date}T07:00:00`);
    const endDate = parseISO(`${date}T15:45:00`);

    // Generate all 15-minute slots for the day
    const allSlots: string[] = [];
    for (let time = startDate; time < endDate; time = addMinutes(time, 15)) {
      allSlots.push(formatISO(time));
    }

    // Fetch existing appointments for the day
    const appointments = await prisma.appointment.findMany({
      where: {
        dateTime: {
          gte: startDate,
          lt: endDate,
        },
        status: "CONFIRMED", // Only confirmed appointments block slots
      },
      include: {
        vehicle: true, // Include vehicle to access vehicleType
      },
    });

    // Block slots based on appointments
    const blockedSlots = new Set<string>();
    appointments.forEach((appointment) => {
      const duration = getDuration(appointment.vehicle.vehicleType);
      let time = new Date(appointment.dateTime);

      for (let i = 0; i < duration / 15; i++) {
        blockedSlots.add(formatISO(time));
        time = addMinutes(time, 15);
      }
    });

    // Mark slots as occupied or free
    const slots = allSlots.map((slot) => ({
      time: slot,
      isOccupied: blockedSlots.has(slot),
    }));

    res.status(200).json({ slots });
  } catch (error) {
    console.error("Error fetching daily occupancy:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}

// Helper function to determine duration based on vehicle type
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
