"use client";

import React, { useState, useEffect } from "react";
import { VehicleType } from "../types/VehicleType";
import VehicleForm from "../components/forms/VehicleForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface Vehicle {
  licensePlate: string;
  model: string;
  vehicleType: VehicleType;
  userId?: string;
}

const GarageSection: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const tireData = [
    { name: "R14", description: "Small Cars", price: 70 },
    { name: "R16", description: "Medium Cars", price: 90 },
    { name: "R17+", description: "Large Vehicles", price: 120 },
  ];


  // Функція для отримання списку авто з сервера
  const fetchVehicles = async () => {
    try {
      const token = await getFirebaseToken(); // Отримання токена

      const res = await fetch("/api/vehicles", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      setError("Failed to load vehicles.");
      console.error(err);
    }
  };


  useEffect(() => {
    fetchVehicles(); // Завантажуємо список авто при завантаженні сторінки
  }, []);

  useEffect(() => {
    setError(null); // Скидуємо помилку при зміні списку авто
  }, [vehicles]);

  const handleAddVehicle = async (vehicle: Vehicle) => {
    if (vehicles.some((v) => v.licensePlate === vehicle.licensePlate)) {
      setError("Vehicle with this license plate already exists");
      return;
    }

    try {
      const token = await getFirebaseToken();

      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Додаємо авторизацію
        },
        body: JSON.stringify(vehicle),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      await fetchVehicles(); // ✅ Оновлюємо весь список після додавання

      setShowForm(false);
    } catch (err) {
      setError("Failed to add vehicle. Please try again.");
      console.error(err);
    }
  };

  const confirmDelete = (licensePlate: string) => {
    setDeleteCandidate(licensePlate);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return;

    try {
      const token = await getFirebaseToken();

      const res = await fetch(`/api/vehicles`, {
        method: "DELETE",
        headers: {
          credentials: "include",
        },
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      setVehicles((prev) => prev.filter((v) => v.licensePlate !== deleteCandidate));
      setDeleteCandidate(null);
    } catch (err) {
      setError("Failed to delete vehicle.");
      console.error(err);
    }
  };


  const handleDeleteCancel = () => {
    setDeleteCandidate(null);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-[var(--background)] text-[var(--foreground)] rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Garage</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {vehicles.length < 5 && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 px-4 py-2 bg-[var(--button-background)] text-[var(--button-text)] rounded hover:shadow-lg transition-transform hover:scale-105"
        >
          Add Vehicle
        </button>
      )}

      {showForm && (
        <VehicleForm
          tireData={tireData}
          onSubmit={handleAddVehicle}
          onCancel={() => setShowForm(false)}
          heading="Add New Vehicle"
          submitButtonLabel="Save Vehicle"
        />
      )}

      <ul className="space-y-4">
        {vehicles.map((vehicle) => (
          <li
            key={vehicle.licensePlate}
            className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-[var(--button-background)] rounded shadow"
          >
            <div>
              <p className="text-sm md:text-base">
                <strong>License Plate:</strong> {vehicle.licensePlate}
              </p>
              <p className="text-sm md:text-base">
                <strong>Model:</strong> {vehicle.model}
              </p>
              <p className="text-sm md:text-base">
                <strong>Type:</strong> {vehicle.vehicleType}
              </p>
            </div>
            <button
              onClick={() => confirmDelete(vehicle.licensePlate)}
              className="mt-2 md:mt-0 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-transform hover:scale-105"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {vehicles.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No vehicles added yet.</p>
      )}

      {deleteCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded shadow-lg max-w-sm mx-auto">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this vehicle?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GarageSection;
async function getFirebaseToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken()
          .then((token) => resolve(token))
          .catch((error) => reject(error));
      } else {
        reject(new Error("No user is signed in"));
      }
    });
  });
}

