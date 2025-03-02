import React, { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./TimeGrid.module.css";

interface SlotGroup {
  startTime: string;
  endTime: string;

interface TimeGridProps {
  date: string;
  vehicleType: string;
  appointments: { dateTime: string }[];
  onSlotSelect: (startTime: string, endTime: string) => void;
}

const VEHICLE_DURATION: Record<string, number> = {
  SMALL_CAR: 45,
  SUV: 60,
  TRUCK: 75,
  DEFAULT: 45,
};
const TIME_FORMAT_OPTIONS = { hour: "2-digit", minute: "2-digit" };

const TimeGrid: React.FC<TimeGridProps> = ({ date, vehicleType, appointments, onSlotSelect }) => {
  const [slotGroups, setSlotGroups] = useState<SlotGroup[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const bookedTimes = useMemo(() => {
    return new Set(appointments.map((appt) => new Date(appt.dateTime).getTime()));
  }, [appointments]);

  useEffect(() => {
    const fetchAvailableGroups = () => {
      const duration = VEHICLE_DURATION[vehicleType] || VEHICLE_DURATION.DEFAULT;
      const startTime = new Date(`${date}T07:00:00`);
      const endTime = new Date(`${date}T15:45:00`);

      const allSlots: Date[] = [];
      for (let time = new Date(startTime); time < endTime; time.setMinutes(time.getMinutes() + 15)) {
        allSlots.push(new Date(time));
      }

      const bookedTimes = new Set(appointments.map((appt) => new Date(appt.dateTime).toISOString()));
      let groupStart: Date | null = null;
      let groupEnd: Date | null = null;

      allSlots.forEach((slotISO, index) => {
        const currentSlot = new Date(slotISO);
        const isBooked = bookedTimes.has(slotISO);

        if (!isBooked) {
          if (!groupStart) {
            groupStart = new Date(currentSlot);
          }
          groupEnd = new Date(currentSlot);
        }

        if ((isBooked || index === allSlots.length - 1) && groupStart && groupEnd) {
        if ((isBooked || index === allSlots.length - 1) && groupStart && groupEnd) {
          const groupDuration = (groupEnd.getTime() - groupStart.getTime()) / (60 * 1000);
            availableGroups.push({
              startTime: groupStart.toISOString(),
              endTime: groupEnd.toISOString(),
            });
          }

          groupStart = null;
          groupEnd = null;
        }
      });
        }
      });

      setSlotGroups(availableGroups);
    };

    fetchAvailableGroups();
  }, [date, vehicleType, appointments]);

  return (
    <div className={styles.grid}>
      {slotGroups.map((group, index) => (
        <SlotGroupComponent
          key={index}
          className={classNames(styles.slotGroup, { [styles.selected]: selectedSlot === group.startTime })}
          selectedSlot={selectedSlot}
          onSlotSelect={onSlotSelect}
          setSelectedSlot={setSelectedSlot}
        />
      ))}
    </div>
  );
};

interface SlotGroupComponentProps {
  group: SlotGroup;
  selectedSlot: string | null;
  onSlotSelect: (startTime: string, endTime: string) => void;
  setSelectedSlot: React.Dispatch<React.SetStateAction<string | null>>;
}

const SlotGroupComponent: React.FC<SlotGroupComponentProps> = ({ group, selectedSlot, onSlotSelect, setSelectedSlot }) => {
  return (
    <div
      className={`${styles.slotGroup} ${selectedSlot === group.startTime ? styles.selected : ""}`}
      onClick={() => {
        setSelectedSlot(group.startTime);
        onSlotSelect(group.startTime, group.endTime);
      }}
      {new Date(group.startTime).toLocaleTimeString([], TIME_FORMAT_OPTIONS)} -{" "}
      {new Date(group.endTime).toLocaleTimeString([], TIME_FORMAT_OPTIONS)}
      </div>
  );
};

export default TimeGrid;

