// src/components/TimeGrid.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { fetchDayOccupancy } from "../api/day-occupancy";
import styles from "./TimeGrid.module.css";

interface Slot {
  time: string; // ISO time string
  occupied: boolean;
}

interface TimeGridProps {
  date: string; // Selected date in ISO format
  vehicleType: string; // Vehicle type to determine slot size
  onSlotSelect: (startTime: string, endTime: string) => void; // Callback on selection
}

const TimeGrid: React.FC<TimeGridProps> = ({ date, vehicleType, onSlotSelect }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await fetchDayOccupancy(date);
        setSlots(response.slots);
      } catch (error) {
        console.error("Error fetching slots:", error);
      }
    };
    fetchSlots();
  }, [date]);

  const slotDuration = getSlotDuration(vehicleType);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "DRAGGABLE_SLOT",
    drop: (item: { startTime: string }) => handleDrop(item.startTime),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleDrop = (startTime: string) => {
    const endTime = calculateEndTime(startTime, slotDuration);
    if (validateSlot(startTime, endTime, slots)) {
      onSlotSelect(startTime, endTime);
    } else {
      alert("Invalid slot selection.");
    }
  };

  const renderSlots = () => {
    return slots.map((slot, index) => (
      <div
        key={index}
        className={`${styles.slot} ${slot.occupied ? styles.occupied : styles.available}`}
      >
        {slot.time}
      </div>
    ));
  };

  return (
    <div className={styles.grid} ref={drop}>
      {renderSlots()}
    </div>
  );
};

export default TimeGrid;

// Helper functions
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

const calculateEndTime = (startTime: string, duration: number): string => {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + duration * 60 * 1000);
  return end.toISOString();
};

const validateSlot = (startTime: string, endTime: string, slots: Slot[]): boolean => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  for (const slot of slots) {
    const slotTime = new Date(slot.time).getTime();
    if (slot.occupied && slotTime >= start && slotTime < end) {
      return false;
    }
  }
  return true;
};
