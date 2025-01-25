// src/components/TimeGrid.tsx

import React, { useEffect, useState } from "react";
import { Appointment } from "../../types/Appointment";
import styles from "./TimeGrid.module.css";

interface Slot {
  time: string; // ISO time string
  isOccupied: boolean;
}

interface TimeGridProps {
  date: string; // Дата, яку обрав користувач
  vehicleType: string; 
  appointments: Appointment[];// Тип авто
  onSlotSelect: (startTime: string, endTime: string) => void; 
  onTimeSelect: (time: string) => void;// Callback для обробки вибору
}

const TimeGrid: React.FC<TimeGridProps> = ({ date, vehicleType, onSlotSelect }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetch(`/api/timeslots?date=${date}&vehicleType=${vehicleType}`);
        if (!response.ok) {
          throw new Error("Failed to fetch time slots");
        }
        const data = await response.json();
        setSlots(data.slots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
      }
    };
    fetchSlots();
  }, [date, vehicleType]);

  const handleSlotClick = (slot: Slot) => {
    if (slot.isOccupied) {
      alert("This slot is already occupied.");
      return;
    }

    const duration = getSlotDuration(vehicleType);
    const startTime = slot.time;
    const endTime = calculateEndTime(slot.time, duration);

    setSelectedSlot(startTime);
    onSlotSelect(startTime, endTime); // Виклик колбека для вибору
  };

  const renderSlots = () =>
    slots.map((slot, index) => (
      <div
        key={index}
        className={`${styles.slot} ${slot.isOccupied ? styles.occupied : styles.available} ${
          selectedSlot === slot.time ? styles.selected : ""
        }`}
        onClick={() => handleSlotClick(slot)}
      >
        {new Date(slot.time).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </div>
    ));

  return <div className={styles.grid}>{renderSlots()}</div>;
};

// Допоміжна функція для обчислення тривалості часу
const getSlotDuration = (vehicleType: string): number => {
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
};

// Допоміжна функція для обчислення кінця слоту
const calculateEndTime = (startTime: string, duration: number): string => {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + duration * 60 * 1000);
  return end.toISOString();
};

export default TimeGrid;
