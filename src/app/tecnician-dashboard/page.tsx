"use client";
import { useState, useEffect } from "react";
import TechnicianTimeGrid from "../components/timegrid/TechnicianTimeGrid";

interface Appointment {
  id: number;
  user: { name: string };
  licensePlate: string;
  type: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  dateTime: string;
  slotCount: number;
}

export default function TechnicianDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetch(`/api/appointments?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch(console.error);
  }, [selectedDate]);

  async function updateStatus(id: number, newStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED") {
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">📅 Розклад техніка</h1>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="mt-2 border p-2 rounded"
      />

      <table className="w-full mt-4 border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th>Час</th>
            <th>Клієнт</th>
            <th>Номер авто</th>
            <th>Послуга</th>
            <th>Статус</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                📭 Немає записів
              </td>
            </tr>
          ) : (
            appointments.map((app) => {
              const appointmentTime = new Date(app.dateTime);
              const now = new Date();
              const canRestore = app.status === "CANCELLED" && appointmentTime > now;
              const canComplete = app.status === "CONFIRMED" && appointmentTime <= now;

              return (
                <tr key={app.id} className="border">
                  <td>{appointmentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                  <td>{app.user.name}</td>
                  <td>{app.licensePlate}</td>
                  <td>{app.type}</td>
                  <td className="font-bold">{app.status}</td>
                  <td>
                    {app.status === "PENDING" && (
                      <button
                        className="bg-green-500 text-white p-1 rounded"
                        onClick={() => updateStatus(app.id, "CONFIRMED")}
                      >
                        Підтвердити
                      </button>
                    )}
                    {canComplete && (
                      <button
                        className="bg-blue-500 text-white p-1 rounded"
                        onClick={() => updateStatus(app.id, "COMPLETED")}
                      >
                        Завершити
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white p-1 ml-2 rounded"
                      onClick={() => updateStatus(app.id, "CANCELLED")}
                    >
                      Скасувати
                    </button>
                    {canRestore && (
                      <button
                        className="bg-yellow-500 text-white p-1 ml-2 rounded"
                        onClick={() => updateStatus(app.id, "CONFIRMED")}
                      >
                        Відновити
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <TechnicianTimeGrid date={selectedDate} />
    </div>
  );
}
