"use client";

import React, { useEffect, useState } from "react";
import useFetchUser from "../hooks/useFetchUser";
import GarageSection from "../components/GarageSection";
import YourAppointments from "../components/YourAppointments";
import AppointmentSection from "../components/AppointmentSection";
import NotAuthenticated from "../components/NotAuthenticated";
import { Vehicle } from "../types/Vehicle";
import { Appointment } from "../types/Appointment";

const UserDashboard: React.FC = () => {
  const user = useFetchUser(); // Хук для отримання користувача
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Отримання записів користувача
  const fetchAppointments = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/appointments?userId=${user?.uid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }, [user]);

  // Завантаження транспортних засобів
  useEffect(() => {
    if (user) {
      fetchVehicles();
      fetchAppointments(); // Завантаження записів одразу після авторизації
    }
  }, [user, fetchAppointments]);

  // Отримання транспортних засобів
  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }

      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Видалення транспортного засобу
  const handleDeleteVehicle = async (licensePlate: string) => {
    try {
      const response = await fetch(`/api/vehicles?licensePlate=${licensePlate}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete vehicle");
      }

      setVehicles((prev) => prev.filter((v) => v.licensePlate !== licensePlate));
      alert("Vehicle deleted successfully");
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete vehicle");
    }
  };

  if (!user) {
    return <NotAuthenticated />;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="dashboard p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome, {user.displayName || "User"}!
      </h1>

      <GarageSection
        vehicles={vehicles}
        onDelete={handleDeleteVehicle}
        onAdd={(vehicle) => setVehicles((prev) => [...prev, { ...vehicle, userId: user.uid }])}
      />
      <YourAppointments
        userId={user.uid}
        appointments={appointments} // Передаємо записи в компонент
      />
      <AppointmentSection
        userId={user.uid}
        vehicles={vehicles}
        refreshAppointments={fetchAppointments} // Передаємо функцію для оновлення записів
      />
    </div>
  );
};

export default UserDashboard;
