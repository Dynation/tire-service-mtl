"use client";

import React, { useState } from "react";
import { VehicleType } from "../types/VehicleType";
import VehicleForm from "../components/forms/VehicleForm";

interface Vehicle {
  licensePlate: string;
  model: string;
  vehicleType: VehicleType;
}

interface GarageProps {
  vehicles: Vehicle[];
  onDelete: (licensePlate: string) => void;
  onAdd: (vehicle: Vehicle) => void; // Пропс для додавання
}

const Garage: React.FC<GarageProps> = ({ vehicles, onDelete, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);

  const tireData = [
    { name: "R14", description: "Small Cars", price: 70 },
    { name: "R16", description: "Medium Cars", price: 90 },
    { name: "R17+", description: "Large Vehicles", price: 120 },
  ];

  const confirmDelete = (licensePlate: string) => {
    setDeleteCandidate(licensePlate);
  };

  const handleDeleteConfirm = () => {
    if (deleteCandidate) {
      onDelete(deleteCandidate);
      setDeleteCandidate(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteCandidate(null);
  };

  const handleAddVehicle = (vehicle: Vehicle) => {
    onAdd(vehicle); // Викликаємо пропс для додавання транспортного засобу
    setShowForm(false); // Закриваємо форму після успіху
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-[var(--background)] text-[var(--foreground)] rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Garage</h2>

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
          onSubmit={handleAddVehicle} // Передаємо логіку додавання
          onCancel={() => setShowForm(false)} // Закриття форми
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

      {/* Модальне вікно для підтвердження видалення */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[var(--background)] text-[var(--foreground)] p-6 rounded shadow-lg max-w-sm mx-auto">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete this vehicle?
            </p>
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

export default Garage;

