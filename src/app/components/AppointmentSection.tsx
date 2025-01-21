import React, { useState, useEffect, useCallback } from "react";
import CalendarPicker from "../components/calendarpicker/calendarPicker";
import { Appointment } from "../types/Appointment";
import { Vehicle } from "../types/Vehicle";

interface AppointmentSectionProps {
  userId: string;
  vehicles: Vehicle[];
  refreshAppointments: () => Promise<void>; // Додайте цю властивість
}

const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  userId,
  vehicles,
  refreshAppointments,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notes, setNotes] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
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
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId]); // Додано `userId` та `refreshAppointments`

  useEffect(() => {
    console.log("UserId is:", userId); // Лог для уникнення "unused var"
    fetchAppointments();
  }, [fetchAppointments, userId]);

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    await refreshAppointments(); // Оновлюємо список після вибору дати
  };

  const handleSubmitAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedVehicle) {
      alert("Please select a vehicle, date, and time.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const newAppointment = {
        dateTime: `${selectedDate}T${selectedTime}`,
        type: "PENDING",
        licensePlate: selectedVehicle.licensePlate,
        notes, // Передаємо notes
      };

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAppointment),
      });

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      await refreshAppointments();
      alert("Appointment successfully created!");
    } catch (error) {
      console.error("Error creating appointment:", error);
      setError("Failed to create appointment");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="appointment-section p-4 max-w-4xl mx-auto bg-[var(--background)] text-[var(--foreground)] rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create Appointment</h2>

      {/* Вибір транспортного засобу */}
      <div className="mb-4">
        <label htmlFor="vehicleSelect" className="block mb-2 text-sm font-medium">
          Select a Vehicle:
        </label>
        <select
          id="vehicleSelect"
          value={selectedVehicle?.licensePlate || ""}
          onChange={(e) =>
            setSelectedVehicle(
              vehicles.find((v) => v.licensePlate === e.target.value) || null
            )
          }
          className="w-full border border-gray-300 p-2 rounded bg-[var(--button-background)] text-[var(--button-text)]"
        >
          <option value="" disabled>
            Select your vehicle
          </option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.licensePlate} value={vehicle.licensePlate}>
              {vehicle.model} ({vehicle.vehicleType})
            </option>
          ))}
        </select>
      </div>

      {/* Календар */}
      <CalendarPicker
        appointments={appointments.map((apt) => ({
          ...apt,
          date: apt.dateTime.split("T")[0],
          time: apt.dateTime.split("T")[1],
          serviceType: apt.status,
        }))}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
        onTimeSelect={setSelectedTime}
        vehicleType={selectedVehicle?.vehicleType || "SMALL_CAR"}
      />

      {/* Підтвердження запису */}
      {selectedDate && selectedTime && selectedVehicle && (
        <div className="mt-4 p-4 bg-[var(--button-background)] rounded shadow">
          <h3 className="text-lg font-bold">Selected Appointment</h3>
          <p>
            <strong>Vehicle:</strong> {selectedVehicle.model}
          </p>
          <p>
            <strong>Date:</strong> {selectedDate}
          </p>
          <p>
            <strong>Time:</strong> {selectedTime}
          </p>
          <div className="mt-2">
            <label
              htmlFor="notes"
              className="block mb-2 text-sm font-medium"
            >
              Additional Notes:
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Add any additional information..."
              className="w-full border border-gray-300 p-2 rounded bg-[var(--button-background)] text-[var(--button-text)]"
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmitAppointment}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Confirm Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentSection;
