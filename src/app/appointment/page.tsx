// src/app/appointment/page.tsx
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
    tireSize: string;
    wheelCount: number;
    vehicleType: VehicleType;
    flatRun: boolean;
    lowProfile: boolean;
    notes: string;
  } | null>(null);

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User is authenticated:", user.displayName);
    }
  }, [isAuthenticated, user]);

  const handleFormSubmit = (values: {
    licensePlate: string;
    tireSize: string;
    wheelCount: number;
    vehicleType: VehicleType;
    flatRun: boolean;
    lowProfile: boolean;
    notes: string;
  }): void => {
    setVehicleType(values.vehicleType);
    setFormValues(values);
    setFormSubmitted(true);
    console.log("Form values:", values);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    console.log(`Appointment set for: ${selectedDate} at ${time}`);
  };

  const handleAddAppointment = () => {
    console.log("Appointment added:", {
      ...formValues,
      date: selectedDate,
      time: selectedTime,
    });
  };

  const handleReappoint = () => {
    setFormSubmitted(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          tireserviceMTL
          <span className={styles.titleUnderline} />
        </h1>
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
              appointments={[]} // Передай реальні дані, якщо вони є
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              onTimeSelect={handleTimeSelect}
              vehicleType={vehicleType}
            />
          </div>
          <div className={styles.slotsSection}>
            {selectedDate ? (
              <>
                <h3>Available Appointments on {selectedDate}</h3>
                <div className={styles.selectedTime}>
                  {selectedTime ? (
                    <div className={styles.appointmentDetails}>
                      <h2 className="text-2xl font-bold mb-4">Check Your Appointment Details</h2>
                      <p><strong>Name:</strong> {user?.displayName || "Guest"}</p>
                      <p><strong>License Plate:</strong> {formValues?.licensePlate}</p>
                      <p><strong>Tire Size:</strong> {formValues?.tireSize}</p>
                      <p><strong>Vehicle Type:</strong> {formValues?.vehicleType}</p>
                      <p><strong>Wheel Count:</strong> {formValues?.wheelCount}</p>
                      <p><strong>Flat Run:</strong> {formValues?.flatRun ? "Yes" : "No"}</p>
                      <p><strong>Low Profile:</strong> {formValues?.lowProfile ? "Yes" : "No"}</p>
                      <p><strong>Notes:</strong> {formValues?.notes}</p>
                      <p><strong>Date:</strong> {selectedDate}</p>
                      <p><strong>Time:</strong> {selectedTime}</p>

                      <div className="flex gap-4 mt-6">
                        <button
                          onClick={handleAddAppointment}
                          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition-transform transform hover:scale-105"
                        >
                          Add Appointment
                        </button>
                        <button
                          onClick={handleReappoint}
                          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-transform transform hover:scale-105"
                        >
                          Reappoint
                        </button>
                      </div>
                    </div>
                  ) : (
                    "Please select a time slot"
                  )}
                </div>
              </>
            ) : (
              <p>Please select a date from the calendar above to see available slots.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;


