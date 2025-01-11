"use client";
import React, { useEffect, useState } from "react";
import Garage from "../components/Garage";
import { VehicleType } from "../types/VehicleType";

interface Vehicle {
  licensePlate: string;
  model: string;
  vehicleType: VehicleType;
}

export default function UserDashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Функція для отримання транспортних засобів з бази даних
  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Отримуємо токен
  
      if (!token) {
        setError("User is not authenticated");
        setLoading(false);
        return;
      }
  
      const response = await fetch("/api/vehicles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
  
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      setError("Error fetching vehicles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  // Функція для додавання нового транспортного засобу
  const handleAddVehicle = async () => {
    console.log("Add vehicle button clicked");
    fetchVehicles(); // Оновити список після додавання
  };

  // Функція для видалення транспортного засобу
  const handleDeleteVehicle = async (licensePlate: string) => {
    try {
      const token = localStorage.getItem("authToken"); // Отримуємо токен з localStorage

      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const response = await fetch(`/api/vehicles?licensePlate=${licensePlate}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Передаємо токен у заголовку
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting vehicle:", errorData);
        throw new Error(errorData.error || "Failed to delete vehicle");
      }

      fetchVehicles(); // Оновити список після видалення
    } catch (err) {
      setError("Error deleting vehicle");
      console.error(err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">User Dashboard</h1>
      <Garage vehicles={vehicles} onAdd={handleAddVehicle} onDelete={handleDeleteVehicle} />
    </div>
  );
}
