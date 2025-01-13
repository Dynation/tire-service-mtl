"use client";

import React, { useEffect, useState } from "react";
import useFetchUser from "../hooks/useFetchUser";
import GarageSection from "../components/GarageSection";
import AppointmentSection from "../components/AppointmentSection";
import NotAuthenticated from "../components/NotAuthenticated";
import { Vehicle } from "../types/Vehicle";


const UserDashboard: React.FC = () => {
  const user = useFetchUser(); // Хук для отримання користувача
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      fetchVehicles();
    }
  }, [user]);

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Отримуємо токен
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
      <AppointmentSection userId={user.uid} vehicles={vehicles} />
    </div>
    

  );
};

export default UserDashboard;

