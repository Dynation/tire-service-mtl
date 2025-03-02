import React, { useEffect, useState, useCallback } from "react";
import styles from "./TimeGrid.module.css";
import { VehicleType } from "../../types/VehicleType";
import { isEqual, parseISO } from "date-fns";
interface SlotGroup {
  startTime: string;
  endTime: string;
}

interface TimeGridProps {
  date: string;
  vehicleType: VehicleType;
  onSlotSelect: (startTime: string, endTime: string) => void;
}

const VEHICLE_SLOTS: Record<VehicleType, number> = {
  SMALL_CAR: 3,
  SUV: 4,
  TRUCK: 5,
};

const TimeGrid: React.FC<TimeGridProps> = ({ date, vehicleType, onSlotSelect }) => {
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [slotGroups, setSlotGroups] = useState<SlotGroup[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const fetchOccupiedSlots = useCallback(async () => {
    try {
      const response = await fetch(`/api/timeslots?date=${date}`);
      if (!response.ok) throw new Error("Failed to fetch timeslots");

      const data = await response.json();
      console.log("API RESPONSE", data);
      setOccupiedSlots(data.occupiedSlots);
    } catch (error) {
      console.error("Error fetching occupied slots:", error);
    }
  }, [date]);
  useEffect(() => {
    fetchOccupiedSlots();
  }, [fetchOccupiedSlots]);

  useEffect(() => {
    const requiredSlots = VEHICLE_SLOTS[vehicleType] || 3;
    const startTime = new Date(`${date}T07:00:00`);
    const endTime = new Date(`${date}T15:45:00`);

    const allSlots: Date[] = [];
    for (let time = new Date(startTime); time < endTime; time.setMinutes(time.getMinutes() + 15)) {
      allSlots.push(new Date(time));
    }

    const occupiedSet = new Set(occupiedSlots);
console.log("occupiedSet", occupiedSet);
    const availableGroups: SlotGroup[] = [];

    for (let i = 0; i <= allSlots.length - requiredSlots; i++) {
      const possibleGroup = allSlots.slice(i, i + requiredSlots);

      if (possibleGroup.some(slot => Array.from(occupiedSet).some(occupied => isEqual(slot, parseISO(occupied))))) {
        continue;
      }

      availableGroups.push({
        startTime: possibleGroup[0].toISOString(),
        endTime: new Date(possibleGroup[possibleGroup.length - 1].getTime() + 15 * 60 * 1000).toISOString(),
      });

      i += requiredSlots - 1;
    }

    setSlotGroups(availableGroups);
  }, [occupiedSlots, vehicleType]);

  return (
    <div className={styles.grid}>
      {slotGroups.map((group, index) => (
        <div
          key={index}
          className={`${styles.slotGroup} ${selectedSlot === group.startTime ? styles.selected : ""}`}
          onClick={() => {
            setSelectedSlot(group.startTime);
            onSlotSelect(group.startTime, group.endTime);
          }}
        >
          {new Date(group.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
          {new Date(group.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      ))}
    </div>
  );
};

export default TimeGrid;
