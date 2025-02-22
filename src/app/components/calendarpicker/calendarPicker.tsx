import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import { EventInput } from "@fullcalendar/core";

import { Appointment } from "../../types/Appointment";
import styles from "./CalendarPicker.module.css";

// Removed redundant local Appointment interface

export interface CalendarPickerProps {
  appointments: Appointment[];
  onDateSelect: (date: string) => void;
  vehicleType: string;
  selectedDate: string | null; 
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  appointments = [],
  onDateSelect,
}) => {
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    const formattedEvents = appointments.map((appt) => ({
      title: `${new Date(appt.dateTime).toLocaleTimeString()} (${appt.type})`,
      start: appt.dateTime,
      allDay: false,
    }));

    setEvents(formattedEvents);
  }, [appointments]);

  const handleDateClick = (info: { dateStr: string }) => {
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
      />
    </div>
  );
};

export default CalendarPicker;

