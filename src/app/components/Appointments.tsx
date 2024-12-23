"use client";
import React, { useEffect, useState } from "react";

interface Appointment {
  id: number;
  dateTime: string;
  type: string;
  status: string;
  vehicle: {
    model: string;
    licensePlate: string;
  };
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/appointments");
      if (!response.ok) throw new Error("Failed to fetch appointments");

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError("Error fetching appointments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id: number) => {
    try {
      const response = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to cancel appointment");

      // Оновити список після скасування
      fetchAppointments();
    } catch (err) {
      setError("Error cancelling appointment");
      console.error(err);
    }
  };

  const filteredAppointments = appointments.filter((appt) =>
    filter === "ALL" ? true : appt.status === filter
  );

  return (
    <div className="p-4 bg-[var(--background)] text-[var(--foreground)] rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>

      <div className="mb-4">
        <label className="mr-2" htmlFor="statusFilter">Filter by status:</label>
        <select title="status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {filteredAppointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredAppointments.map((appt) => (
            <li key={appt.id} className="p-4 bg-[var(--button-background)] rounded shadow">
              <p>
                <strong>Date:</strong> {new Date(appt.dateTime).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(appt.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p>
                <strong>Vehicle:</strong> {appt.vehicle.model} ({appt.vehicle.licensePlate})
              </p>
              <p>
                <strong>Type:</strong> {appt.type}
              </p>
              <p>
                <strong>Status:</strong> {appt.status}
              </p>
              {appt.status === "PENDING" || appt.status === "CONFIRMED" ? (
                <button
                  onClick={() => cancelAppointment(appt.id)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel Appointment
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Appointments;
