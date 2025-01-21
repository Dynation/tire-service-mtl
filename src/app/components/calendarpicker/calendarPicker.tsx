import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import { EventInput } from "@fullcalendar/core";
import styles from "./CalendarPicker.module.css";

export interface Appointment {
  date: string;
  time: string;
  serviceType: string;
  vehicleType: string;
}

export interface CalendarPickerProps {
  appointments: Appointment[];
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
  onTimeSelect: (time: string) => void;
  vehicleType: string;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  appointments = [],
  onDateSelect,
  selectedDate,
  onTimeSelect,
  vehicleType,
}) => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Кеш таймслотів для кожної дати
  const timeSlotsCache = useRef<Record<string, string[]>>({});

  useEffect(() => {
    let isCancelled = false;

    const fetchTimeSlots = async () => {
      if (!selectedDate) return;

      // Перевіряємо, чи є таймслоти у кеші
      if (timeSlotsCache.current[selectedDate]) {
        setTimeSlots(timeSlotsCache.current[selectedDate]);
        return;
      }

      setTimeSlots([]);
      setLoadingSlots(true);

      try {
        const response = await fetch(
          `/api/timeslots?date=${selectedDate}&vehicleType=${vehicleType}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch time slots");
        }
        const data = await response.json();
        if (!isCancelled) {
          timeSlotsCache.current[selectedDate] = data.availableSlots; // Кешуємо слоти
          setTimeSlots(data.availableSlots);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error fetching time slots:", error);
        }
      } finally {
        if (!isCancelled) {
          setLoadingSlots(false);
        }
      }
    };

    fetchTimeSlots();

    return () => {
      isCancelled = true;
    };
  }, [selectedDate, vehicleType]);

  useEffect(() => {
    const formattedEvents = appointments.map((appointment) => ({
      title: `${appointment.time} (${appointment.serviceType})`,
      start: `${appointment.date}T${appointment.time}`,
      allDay: false,
    }));

    setEvents(formattedEvents);
  }, [appointments]);

  const handleDateClick = (info: { dateStr: string }) => {
    onDateSelect(info.dateStr);
  };

  const handleTimeClick = (time: string) => {
    onTimeSelect(time);
  };

  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, momentTimezonePlugin]}
        timeZone="America/Toronto"
        locale="en"
        initialView="dayGridMonth"
        initialDate={new Date().toISOString().split("T")[0]}
        events={events}
        dateClick={handleDateClick}
        selectable
      />

      {selectedDate && (
        <div className={styles.timeSlotsSection}>
          <h3 className={styles.sectionTitle}>
            {loadingSlots
              ? "Loading available slots..."
              : `Available Appointments on ${selectedDate}`}
          </h3>
          <div className={styles.timeSlotsGrid}>
            {loadingSlots ? (
              <p>Loading...</p>
            ) : timeSlots.length === 0 ? (
              <p>No available slots for the selected date.</p>
            ) : (
              timeSlots.map((slot, index) => {
                const timeString = new Date(slot).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                return (
                  <div
                    key={`${slot}-${index}`}
                    onClick={() => handleTimeClick(timeString)}
                    className={styles.available}
                  >
                    {timeString}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
