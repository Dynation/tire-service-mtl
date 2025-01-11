//appointment page
"use client";
import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import CalendarPicker from "../../app/components/calendarpicker/calendarPicker";
import VehicleForm from "../../app/components/forms/VehicleForm";
import AppointmentDetails from "../../app/components/appointments/AppointmentDetails";
import useFetchUser from "../../app/hooks/useFetchUser";
import { VehicleType } from "../../app/types/VehicleType";
import styles from "./AppointmentPage.module.css";

const AppointmentPage: React.FC = () => {
  const user = useFetchUser();
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
  } | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFormSubmit = (values: {
    licensePlate: string;
    model: string;
    tireSize: string;
    wheelCount: number;
    vehicleType: VehicleType;
    flatRun: boolean;
    lowProfile: boolean;
    notes: string;
  }) => {
    setVehicleType(values.vehicleType);
    setFormValues(values);
    setFormSubmitted(true);
    setIsConfirmed(false);
  };

  const handleDateSelect = (date: string) => setSelectedDate(date);
  const handleTimeSelect = (time: string) => setSelectedTime(time);
  const handleConfirmDetails = () => setIsConfirmed(true);

  

const handleAddAppointment = async () => {
    if (!formValues || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const auth = getAuth(); // Отримуємо Firebase Auth
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("Користувач не авторизований");
        setIsSubmitting(false);
        return;
      }

      const token = await currentUser.getIdToken(); // Отримуємо токен користувача

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Використовуємо отриманий токен
        },
        body: JSON.stringify({
          ...formValues,
          userId: currentUser.uid, // Додаємо UID користувача
          dateTime: `${selectedDate}T${selectedTime}`,
        }),
      });

      if (response.ok) {
        setSuccessMessage("Your appointment is PENDING. You will receive an email once it's CONFIRMED.");
      } else {
        const errorData = await response.json();
        console.error("Failed to add appointment:", errorData);
        throw new Error(errorData.error || "Failed to add appointment");
      }
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
        <h2>{user ? `WELCOME ${user.displayName || "USER"}` : "WELCOME USER"}</h2>
      </header>

      {!formSubmitted ? (
        <VehicleForm
          tireData={[
            { name: "Шини R14-R15", description: "Шиномонтаж для легкових автомобілів з радіусом R14-R15.", price: 70 },
            { name: "Шини R16", description: "Шиномонтаж для автомобілів з радіусом R16.", price: 90 },
            { name: "Шини R17+", description: "Шини преміум-класу або для позашляховиків.", price: 100 },
          ]}
          onSubmit={handleFormSubmit}
        />
      ) : (
        <div>
          <CalendarPicker
            appointments={[]}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            onTimeSelect={handleTimeSelect}
            vehicleType={vehicleType}
          />
          {formValues && selectedDate && selectedTime && (
            <AppointmentDetails
              licensePlate={formValues.licensePlate}
              model={formValues.model}
              vehicleType={VehicleType[formValues.vehicleType]}
              tireSize={formValues.tireSize}
              wheelCount={formValues.wheelCount}
              flatRun={formValues.flatRun}
              lowProfile={formValues.lowProfile}
              notes={formValues.notes}
              date={selectedDate}
              time={selectedTime}
              onConfirm={handleConfirmDetails}
              onAddAppointment={handleAddAppointment}
              onReappoint={handleReappoint}
              isSubmitting={isSubmitting}
              isConfirmed={isConfirmed}
              successMessage={successMessage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
