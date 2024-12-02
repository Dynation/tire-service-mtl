// src/app/components/calendarpicker/CalendarPicker.tsx
"use client";
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import styles from "./CalendarPicker.module.css";

export interface Appointment {
  date: string; // ISO string, e.g., "2024-11-27"
  time: string; // Localized time, e.g., "08:45 AM"
  serviceType: string;
  vehicleType: VehicleType;
}

export type VehicleType = "SMALL_CAR" | "SUV" | "TRUCK";

export interface CalendarPickerProps {
  appointments: Appointment[];
  onDateSelect: (date: string) => void;
  selectedDate: string | null;
  onTimeSelect: (time: string) => void;
  vehicleType: VehicleType; // New prop to handle vehicle type
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  appointments = [],
  onDateSelect,
  selectedDate,
  onTimeSelect,
  vehicleType,
}) => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);

  useEffect(() => {
    if (!selectedDate) return;

    const today = new Date();
    const selected = new Date(selectedDate);
    const slots: Date[] = [];

    // Determine appointment duration based on vehicle type
    const getAppointmentDuration = (vehicleType: VehicleType) => {
      switch (vehicleType) {
        case "SMALL_CAR":
          return 45; // 45 minutes for small cars
        case "SUV":
          return 60; // 60 minutes for SUVs
        case "TRUCK":
          return 75; // 75 minutes for trucks
        default:
          return 45; // Default to 45 minutes
      }
    };

    const duration = getAppointmentDuration(vehicleType);

    // Generate time slots from 6:00 to 22:00 with the calculated duration interval
    for (let hour = 6; hour <= 21; hour++) {
      let slotTime = new Date(selected);
      slotTime.setHours(hour, 0, 0, 0);

      while (slotTime.getHours() === hour && slotTime.getHours() < 22) {
        // Add slot to the list only if the slot is not in the past
        if (slotTime > today) {
          slots.push(new Date(slotTime));
        }
        // Increase the time by appointment duration
        slotTime = new Date(slotTime.getTime() + duration * 60000); // duration in minutes
      }
    }

    setTimeSlots(slots);
  }, [selectedDate, vehicleType]);

  useEffect(() => {
    // Format appointments as events for FullCalendar
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

  const handleTimeClick = (time: Date) => {
    const formattedTime = time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    onTimeSelect(formattedTime);
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Календарь */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        selectable
      />

      {/* Убедимся, что временные слоты отображаются только один раз под календарем */}
      {selectedDate && (
        <div className={styles.timeSlotsSection}>
          <h3 className={styles.sectionTitle}>Available Appointments on {selectedDate}</h3>
          <div className={styles.timeSlotsGrid}>
            {timeSlots.length === 0 ? (
              <p>No available slots for the selected date.</p>
            ) : (
              timeSlots.map((time, index) => (
                <div
                  key={`${time.toISOString()}-${index}`}
                  onClick={() => handleTimeClick(time)}
                  className={`${styles.timeSlot} ${
                    appointments.some(
                      (appt) =>
                        appt.date === selectedDate &&
                        appt.time === time.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                    )
                      ? styles.occupied
                      : styles.available
                  }`}
                >
                  {time.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}{" "}
                  {appointments.some(
                    (appt) =>
                      appt.date === selectedDate &&
                      appt.time === time.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                  )
                    ? "(Occupied)"
                    : "(Available)"}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
