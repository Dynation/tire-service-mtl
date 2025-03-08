import React, { useState, useEffect } from "react";
import clsx from "clsx";
import styles from "./TimeGrid.module.css";
import TechnicianForm from "../forms/TechnicianForm";



interface Appointment {
  id: number;
  user: { name: string };
  type: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  dateTime: string;
  slotCount: number;
  licensePlate: string;
}

interface TimeSlot {
  startTime: string;
  occupied: boolean;
  appointment?: Appointment;
}

interface TechnicianTimeGridProps {
  date: string;
}

const TechnicianTimeGrid: React.FC<TechnicianTimeGridProps> = ({ date }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appointmentsRes, timeslotsRes] = await Promise.all([
          fetch(`/api/appointments?date=${date}`).then((res) => res.json()),
          fetch(`/api/timeslots?date=${date}`).then((res) => res.json()),
        ]);

        const occupiedSlots = new Set(timeslotsRes.occupiedSlots);
        const allSlots: TimeSlot[] = [];
        let currentTime = new Date(`${date}T07:00:00`);

        while (currentTime < new Date(`${date}T16:00:00`)) {
          const slotKey = new Date(currentTime).toISOString();
          const appointment = appointmentsRes.find(
            (app: any) => new Date(app.dateTime).toISOString() === slotKey
          );

          const isPartOfOccupiedGroup = appointmentsRes.some((app: any) => {
            const appTime = new Date(app.dateTime);
            const slotsRequired = app.slotCount || 3;

            for (let i = 0; i < slotsRequired; i++) {
              const groupSlot = new Date(appTime.getTime() + i * 15 * 60 * 1000).toISOString();
              if (groupSlot === slotKey) return true;
            }
            return false;
          });

          allSlots.push({
            startTime: slotKey,
            occupied: occupiedSlots.has(slotKey) || isPartOfOccupiedGroup,
            appointment: appointment || null,
          });

          currentTime = new Date(currentTime.getTime() + 15 * 60 * 1000);
        }

        setTimeSlots(allSlots);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [date]);

  const handleSlotSelect = (startTime: string, event: React.MouseEvent) => {
    event.stopPropagation();

    const index = timeSlots.findIndex(slot => slot.startTime === startTime);
    if (index === -1 || timeSlots[index].occupied) return;

    const selectedSlotCount = 3; // Скільки слотів обираємо за замовчуванням
    let newSelection: string[] = [];

    for (let i = 0; i < selectedSlotCount; i++) {
      if (index + i < timeSlots.length && !timeSlots[index + i].occupied) {
        newSelection.push(timeSlots[index + i].startTime);
      } else {
        break;
      }
    }

    if (newSelection.length < selectedSlotCount) {
      alert("⚠️ Недостатньо слотів! Можливо, варто вибрати інший час або день.");
    }

    setSelectedSlots(newSelection);
  };

  const handleOpenPopup = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowPopup(true);
  };


  const adjustSlotCount = (increase: boolean, event: React.MouseEvent) => {
    event.stopPropagation();

    if (increase) {
      const nextIndex = timeSlots.findIndex(slot => slot.startTime === selectedSlots[selectedSlots.length - 1]) + 1;
      if (nextIndex < timeSlots.length && !timeSlots[nextIndex].occupied) {
        setSelectedSlots([...selectedSlots, timeSlots[nextIndex].startTime]);
      }
    } else {
      if (selectedSlots.length > 1) {
        setSelectedSlots(selectedSlots.slice(0, -1));
      } else {
        alert("⚠️ Мінімальний запис — 1 слот.");
      }
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-4xl font-semibold">📅 Всі слоти на день</h2>
      <div className={styles.grid}>
        {timeSlots.map((slot) => {
          const slotTime = new Date(slot.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <div
              key={slot.startTime}
              className={clsx("border p-4", {
                [styles.occupied]: slot.occupied,
                [styles.free]: !slot.occupied,
                [styles.selected]: selectedSlots.includes(slot.startTime),
              })}
              onClick={(e) => handleSlotSelect(slot.startTime, e)}
            >
              <div>{slotTime}</div>
              <div>{slot.occupied ? slot.appointment?.status || "Зайнято" : "Вільний"}</div>
              <div>{slot.appointment?.user.name || "_"}</div>
              <div>{slot.appointment?.licensePlate || "_"}</div>
              <div>{slot.appointment?.type || "_"}</div>
              {selectedSlots.includes(slot.startTime) && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded"
                    onClick={(e) => adjustSlotCount(true, e)}
                  >
                    ➕
                  </button>
                  {selectedSlots.includes(slot.startTime) && selectedSlots[0] === slot.startTime && (
                    <button
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={handleOpenPopup}
                    >
                      📌 Записати
                    </button>
                  )}

                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={(e) => adjustSlotCount(false, e)}
                  >
                    ➖
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showPopup && (
        console.log("showPopup", showPopup),

        <div className="overlay active popup" >
          <TechnicianForm
            startTime={selectedSlots[0]}
            onClose={() => setShowPopup(false)}
          />
        </div>
      )}
    </div>
  );
};

export default TechnicianTimeGrid;

