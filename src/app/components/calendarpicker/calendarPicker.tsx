"use client";
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
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

  const getAppointmentDuration = (vehicleType: VehicleType): number => {
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

  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }
  
    const today = new Date();
    today.setSeconds(0, 0); // Обнуляємо секунди і мілісекунди для точного порівняння
    const selected = new Date(`${selectedDate}T00:00:00`);
    const slots: Date[] = [];
    const duration = getAppointmentDuration(vehicleType);
  
    const isToday =
      today.getDate() === selected.getDate() &&
      today.getMonth() === selected.getMonth() &&
      today.getFullYear() === selected.getFullYear();
  
    console.log("Is Today:", isToday);
  
    for (let hour = 6; hour <= 23; hour++) {
      let slotTime = new Date(selected);
      slotTime.setHours(hour, 0, 0, 0);
  
      while (slotTime.getHours() === hour && slotTime.getHours() < 22) {
        if (isToday && slotTime <= today) {
          console.log("Skipping past slot:", slotTime);
        } else if (slotTime < today) {
          console.log("Skipping slot for past date:", slotTime);
        } else {
          console.log("Adding slot:", slotTime);
          slots.push(new Date(slotTime));
        }
        slotTime = new Date(slotTime.getTime() + duration * 60000);
      }
    }
  
    setTimeSlots(slots);
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

  const handleTimeClick = (time: Date) => {
    const formattedTime = time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    console.log("Selected Time:", formattedTime);
    onTimeSelect(formattedTime);
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
            Available Appointments on {selectedDate}
          </h3>
          <div className={styles.timeSlotsGrid}>
            {timeSlots.length === 0 ? (
              <p>No available slots for the selected date.</p>
            ) : (
              timeSlots.map((time, index) => {
                const timeString = time.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });

                const isOccupied = appointments.some(
                  (appt) =>
                    appt.date === selectedDate &&
                    appt.time === timeString
                );

                return (
                  <div
                    key={`${time.toISOString()}-${index}`}
                    onClick={() => !isOccupied && handleTimeClick(time)}
                    className={`${styles.timeSlot} ${
                      isOccupied ? styles.occupied : styles.available
                    }`}
                  >
                    {timeString} {isOccupied ? "(Occupied)" : "(Available)"}
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

