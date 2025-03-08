"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import CalendarPicker from "./calendarpicker/calendarPicker";
import { Appointment } from "../types/Appointment";
import TimeGrid from "./timegrid/TimeGrid";
import { Vehicle } from "../types/Vehicle";
import { VehicleType } from "../types/VehicleType";

interface AppointmentSectionProps {
  userId: string;
  vehicles: Vehicle[];
  refreshAppointments: () => Promise<void>;
}

const VEHICLE_SLOT_MAP: Record<VehicleType, number> = {
  SMALL_CAR: 3,
  SUV: 4,
  TRUCK: 5,
  ONE_SLOT: 1,
  TWO_SLOTS: 2,
};

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
  const [showVehicleWarning, setShowVehicleWarning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const vehicleSelectRef = useRef<HTMLSelectElement | null>(null);

  // Завантаження записів
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/appointments`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data: Appointment[] = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    if (!selectedVehicle) {
      setShowVehicleWarning(true);
      setTimeout(() => vehicleSelectRef.current?.focus(), 100);
    } else {
      setShowVehicleWarning(false);
    }
    await fetchAppointments();
  };

  const handleSubmitAppointment = async () => {
    if (!selectedTime || !selectedVehicle) {
      alert("Please select a vehicle, date, and time.");
      return;
    }

    try {
      setIsSubmitting(true);
      const slotCount = VEHICLE_SLOT_MAP[selectedVehicle.vehicleType] || 3;
      const newAppointment = {
        dateTime: selectedTime,
        type: "TIRE_ROTATION",
        status: "PENDING",
        licensePlate: selectedVehicle.licensePlate,
        notes,
        slotCount,
      };

      console.log("Submitting appointment:", newAppointment);

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newAppointment),
      });

      if (!response.ok) throw new Error("Failed to create appointment");

      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 3000);
      await fetchAppointments();
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVehicleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = vehicles.find((v) => v.licensePlate === e.target.value) || null;
    setSelectedVehicle(selected);
    if (selected) setShowVehicleWarning(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="appointment-section p-4 max-w-4xl mx-auto bg-[var(--background)] text-[var(--foreground)] rounded shadow-lg">
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          ✅ Appointment successfully created!
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Create Appointment</h2>

      <div className="mb-4">
        <label htmlFor="vehicleSelect" className="block mb-2 text-sm font-medium">Select a Vehicle:</label>
        <select
          ref={vehicleSelectRef}
          id="vehicleSelect"
          value={selectedVehicle?.licensePlate || ""}
          onChange={handleVehicleSelect}
          className={`w-full border p-2 rounded transition ${showVehicleWarning ? "border-red-500 ring-2 ring-red-300" : "border-gray-300"}`}
        >
          <option value="" disabled>Select your vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.licensePlate} value={vehicle.licensePlate}>
              {vehicle.model} ({vehicle.vehicleType})
            </option>
          ))}
        </select>
        {showVehicleWarning && (
          <p className="text-red-500 text-sm font-medium mt-2">⚠️ Please select a vehicle before choosing a time slot.</p>
        )}
      </div>

      <CalendarPicker
        appointments={appointments.map((appt) => ({ ...appt, date: appt.dateTime.split("T")[0], time: appt.dateTime.split("T")[1] }))}
        onDateSelect={handleDateSelect}
        vehicleType={selectedVehicle?.vehicleType || "SMALL_CAR"}
        selectedDate={selectedDate}
      />

      {selectedDate && selectedVehicle && (
        <TimeGrid date={selectedDate ?? ""} vehicleType={selectedVehicle?.vehicleType ?? "SMALL_CAR"} onSlotSelect={(startTime) => setSelectedTime(startTime)} />
      )}

      {selectedDate && selectedTime && selectedVehicle && (
        <div className="mt-4 p-4 bg-[var(--button-background)] rounded shadow">
          <h3 className="text-lg font-bold">Selected Appointment</h3>
          <p><strong>Vehicle:</strong> {selectedVehicle.model}</p>
          <p><strong>Date:</strong> {selectedDate}</p>
          <p><strong>Time:</strong> {selectedTime}</p>
          <button onClick={handleSubmitAppointment} disabled={isSubmitting} className={`mt-2 px-4 py-2 rounded transition ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>
            {isSubmitting ? "Processing..." : "Confirm Appointment"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentSection;