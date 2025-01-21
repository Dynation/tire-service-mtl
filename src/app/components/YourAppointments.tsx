import React, { useEffect, useState } from "react";
import { Appointment } from "../types/Appointment";

interface YourAppointmentsProps {
  userId: string;
  appointments: Appointment[];
}

const YourAppointments: React.FC<YourAppointmentsProps> = ({ userId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Отримання записів користувача
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("User is not authenticated");
        }

        const response = await fetch(`/api/appointments?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        console.log("Fetched appointments:", data); // Лог для перевірки даних
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  const formatDate = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="your-appointments p-4 bg-[var(--background)] text-[var(--foreground)] rounded shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
      <ul className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appt) => (
            <li
              key={appt.id}
              className="p-4 bg-[var(--button-background)] rounded shadow"
            >
              <p>
                <strong>License Plate:</strong> {appt.licensePlate || "N/A"}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(appt.dateTime)}
              </p>
              <p>
                <strong>Time:</strong> {formatTime(appt.dateTime)}
              </p>
              <p>
                <strong>Status:</strong> {appt.status}
              </p>
              <p>
                <strong>Notes:</strong> {appt.notes || "No notes provided"}
              </p>
              {appt.status === "CONFIRMED" && (
                <button
                  onClick={() => alert("Cancel appointment logic here")}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel Appointment
                </button>
              )}
            </li>
          ))
        ) : (
          <li>
            <p>No appointments found.</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default YourAppointments;
