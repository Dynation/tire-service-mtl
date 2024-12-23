"use client";
import React, { useState, useEffect } from "react";
import CalendarPicker from "../../app/components/calendarpicker/calendarPicker";
import { VehicleType } from "../../app/types/VehicleType";
import VehicleForm from "../../app/components/forms/VehicleForm";
import styles from "./AppointmentPage.module.css";
import { useAuth } from "../../app/context/AuthContext";

const AppointmentPage: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<VehicleType>(VehicleType.SMALL_CAR);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formValues, setFormValues] = useState<{
    licensePlate: string;
    model: string;
    tireSize: string;
    wheelCount: number;
    vehicleType: VehicleType;
    flatRun: boolean;
    lowProfile: boolean;
    notes: string;
    vehicleId: string;
    type: string;
  } | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User is authenticated:", user.displayName);
    }
  }, [isAuthenticated, user]);

  const handleFormSubmit = (values: {
    licensePlate: string;
    model: string;
    tireSize: string;
    wheelCount: number;
    vehicleType: VehicleType;
    flatRun: boolean;
    lowProfile: boolean;
    notes: string;
  }): void => {
    setVehicleType(values.vehicleType);
    setFormValues({ 
      ...values, 
      vehicleId: values.licensePlate,
      type: "TIRE"
    });
    setFormSubmitted(true);
    setIsConfirmed(false);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    console.log(`Appointment set for: ${selectedDate} at ${time}`);
  };

  const handleConfirmDetails = () => {
    setIsConfirmed(true);
  };

  const handleAddAppointment = async () => {
    if (!formValues || !selectedDate || !selectedTime) {
      console.error("Form values, selected date, or selected time is missing.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    let formattedTime = "";

    if (selectedTime) {
      const timeParts = selectedTime.match(/(\d{2}):(\d{2})\s?(AM|PM)/);
      if (timeParts) {
        let hours = timeParts[1];
        const minutes = timeParts[2];
        const period = timeParts[3];

        if (period === "PM" && hours !== "12") {
          hours = String(Number(hours) + 12);
        } else if (period === "AM" && hours === "12") {
          hours = "00";
        }

        formattedTime = `${hours}:${minutes}`;
      }
    }

    const appointmentDateTime = new Date(`${selectedDate}T${formattedTime}`).toISOString();
    console.log("Formatted appointment dateTime:", appointmentDateTime);

    try {
      const appointmentData = {
        licensePlate: formValues.licensePlate,
        model: formValues.model || "Unknown",
        vehicleType: formValues.vehicleType,
        dateTime: appointmentDateTime,
        type: "TIRE",
        tireSize: formValues.tireSize,
        wheelCount: Number(formValues.wheelCount),
        flatRun: formValues.flatRun,
        lowProfile: formValues.lowProfile,
        notes: formValues.notes,
        userId: user?.uid,
      };

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error("Failed to add appointment");
      }
      console.log("Appointment successfully added!");
  
      setSuccessMessage("Your appointment is PENDING. You will receive an email once it's CONFIRMED.");
    } catch (error) {
      console.error("Error adding appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReappoint = () => {
    setFormSubmitted(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setIsConfirmed(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>tireserviceMTL</h1>
        <h2>{isAuthenticated && user ? `WELCOME ${user.displayName}` : "WELCOME USER"}</h2>
      </header>

      {!formSubmitted ? (
        <section className={styles.vehicleFormSection}>
          <h3>Enter Your Vehicle Details</h3>
          <VehicleForm
            tireData={[
              { name: "Шини R14-R15", description: "Шиномонтаж для легкових автомобілів з радіусом R14-R15.", price: 70 },
              { name: "Шини R16", description: "Шиномонтаж для автомобілів з радіусом R16.", price: 90 },
              { name: "Шини R17+", description: "Шини преміум-класу або для позашляховиків.", price: 100 },
            ]}
            onSubmit={handleFormSubmit}
          />
        </section>
      ) : (
        <div className={styles.calendarAndSlotsContainer}>
          <div className={styles.calendarSection}>
            <h3>Select a Date for Your Appointment</h3>
            <CalendarPicker
              appointments={[]}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              onTimeSelect={handleTimeSelect}
              vehicleType={vehicleType}
            />
          </div>

          <div className={styles.slotsSection}>
          {selectedDate && selectedTime && formValues ? (
  <>
    <h2 className="text-2xl font-bold mb-4">Check Your Appointment Details</h2>
    <div className="bg-[var(--button-background)] text-[var(--button-text)] p-4 rounded shadow-lg mb-4">
      <ul className="space-y-2">
        <li><strong>License Plate:</strong> {formValues.licensePlate}</li>
        <li><strong>Model:</strong> {formValues.model}</li>
        <li><strong>Vehicle Type:</strong> {formValues.vehicleType}</li>
        <li><strong>Tire Size:</strong> {formValues.tireSize}</li>
        <li><strong>Wheel Count:</strong> {formValues.wheelCount}</li>
        <li><strong>Flat Run:</strong> {formValues.flatRun ? "Yes" : "No"}</li>
        <li><strong>Low Profile:</strong> {formValues.lowProfile ? "Yes" : "No"}</li>
        <li><strong>Notes:</strong> {formValues.notes}</li>
        <li><strong>Date:</strong> {selectedDate}</li>
        <li><strong>Time:</strong> {selectedTime}</li>
      </ul>
    </div>

    {!isConfirmed ? (
      <>
        <p className="mb-4">Please review your details and confirm before adding the appointment.</p>
        <button onClick={handleConfirmDetails} className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          Confirm Details
        </button>
      </>
    ) : (
      <button
        onClick={handleAddAppointment}
        disabled={isSubmitting}
        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {isSubmitting ? "Submitting..." : "Add Appointment"}
      </button>
    )}

    <button onClick={handleReappoint} className="ml-4 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
      Reappoint
    </button>

    {successMessage && (
      <div className="mt-4 p-4 bg-green-100 text-green-700 rounded shadow">
        {successMessage}
      </div>
    )}
  </>
) : (
  <p>Please select a date and time.</p>
)}

          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
