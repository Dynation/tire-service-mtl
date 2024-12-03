// src/app/appointment/page.tsx
"use client";
import React, { useState, useContext } from "react";
import CalendarPicker, { VehicleType } from "../components/calendarpicker/calendarPicker";
import styles from "./AppointmentPage.module.css";
import AuthContext from "../../app/context/AuthContext"; // Путь к контексту авторизации

const AppointmentPage: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Получаем информацию об авторизации пользователя из контекста
  const { isAuthenticated, user } = useContext(AuthContext);

  // Функция для обработки выбора типа транспортного средства
  const handleVehicleSelect = (type: VehicleType) => {
    setVehicleType(type);
  };

  // Функция для обработки выбора даты
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  // Функция для обработки выбора времени
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    console.log(`Appointment set for: ${selectedDate} at ${time}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          tireserviceMTL
          <span className={styles.titleUnderline} />
        </h1>
        <h2>
          {isAuthenticated ? `WELCOME ${user?.name}` : "WELCOME USER"}
        </h2>
      </header>

      {!vehicleType ? (
        <section className={styles.vehicleTypeButtons}>
          <h3>Select Your Vehicle Type</h3>
          <button
            onClick={() => handleVehicleSelect("SMALL_CAR")}
            className={styles.vehicleTypeButton}
          >
            Small Car
          </button>
          <button
            onClick={() => handleVehicleSelect("SUV")}
            className={styles.vehicleTypeButton}
          >
            SUV
          </button>
          <button
            onClick={() => handleVehicleSelect("TRUCK")}
            className={styles.vehicleTypeButton}
          >
            Truck
          </button>
        </section>
      ) : (
        <div className={styles.calendarAndSlotsContainer}>
          {/* Календарь */}
          <div className={styles.calendarSection}>
            <h3>Select a Date for Your Appointment</h3>
            <CalendarPicker
              appointments={[]} // Здесь можно добавить данные о существующих записях
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              onTimeSelect={handleTimeSelect}
              vehicleType={vehicleType}
            />
          </div>

          {/* Временные Слоты и Информация о Бронировании */}
          <div className={styles.slotsSection}>
            {selectedDate ? (
              <>
                <h3>Available Appointments on {selectedDate}</h3>
                <div className={styles.selectedTime}>
                  {selectedTime ? (
                    <div className={styles.appointmentDetails}>
                      <p><strong>Name:</strong> {isAuthenticated ? user?.name : "Guest"}</p>
                      <p><strong>Vehicle Type:</strong> {vehicleType}</p>
                      <p><strong>Date:</strong> {selectedDate}</p>
                      <p><strong>Time:</strong> {selectedTime}</p>
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

