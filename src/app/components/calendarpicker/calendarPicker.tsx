import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import { EventInput } from "@fullcalendar/core";
import { VehicleType} from "../../types/VehicleType";
import styles from "./CalendarPicker.module.css";

interface CalendarPickerProps {
  appointments: {
    date: string;
    time: string;
    id: string;
    dateTime: string;
    type:  "TIRE"|"REPAIR";
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    licensePlate: string;
    vehicleType: VehicleType;
    vehicleId: string;
    notes: string | null;
  }[];
  onDateSelect: (date: string) => Promise<void>;
  vehicleType: string;
  selectedDate: string | null;
}

export interface Appointment {
  id: string;
  dateTime: string;
  type: "TIRE_ROTATION"; // Change to match the expected type
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  licensePlate: string;
  vehicleType: VehicleType;
  vehicleId: string;
  notes: string | null;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ appointments, onDateSelect }) => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [disabledDays, setDisabledDays] = useState<string[]>([]);

  useEffect(() => {
    const formattedEvents = appointments.map((appt) => {
      const date = new Date(appt.dateTime);
      const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      const formattedDate = localDate.toISOString().split(':00.000')[0];
      
      return {
      title: formattedDate,
      start: formattedDate,
      allDay: true,
      };
    });

    setEvents(formattedEvents);
  }, [appointments]);

  useEffect(() => {
    // Визначаємо дати, які мають 100% зайняті слоти
    const groupedByDate: Record<string, number> = {};

    appointments.forEach((appt) => {
      const dateKey = new Date(appt.dateTime).toISOString().split("T")[0];
      groupedByDate[dateKey] = (groupedByDate[dateKey] || 0) + 1;
    });

    // Припускаємо, що день заповнений, якщо >= 32 записів (8 годин * 4 слоти/год)
    const fullDays = Object.entries(groupedByDate)
      .filter(([, count]) => count >= 32)
      .map(([date]) => date);

    setDisabledDays(fullDays);
  }, [appointments]);

  const handleDateClick = (info: { dateStr: string }) => {
    if (disabledDays.includes(info.dateStr)) return; // Забороняємо вибір
    onDateSelect(info.dateStr);
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
        validRange={{
          start: new Date().toISOString().split("T")[0], // Не дає вибрати минулі дні
        }}
        dayCellClassNames={({ date }) =>
          disabledDays.includes(date.toISOString().split("T")[0]) ? styles.disabledDay : ""
        }
      />
    </div>
  );
};

export default CalendarPicker;
