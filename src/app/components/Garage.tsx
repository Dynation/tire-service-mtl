"use client";
import React from "react";
import { VehicleType } from "../types/VehicleType";

interface Vehicle {
  licensePlate: string;
  model: string;
  vehicleType: VehicleType;
}

interface GarageProps {
  vehicles: Vehicle[];
  onDelete: (licensePlate: string) => void;
  onAdd: () => void;
}

const Garage: React.FC<GarageProps> = ({ vehicles, onDelete, onAdd }) => {
  return (
    <div className="p-4 bg-[var(--background)] text-[var(--foreground)] rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Garage</h2>
      
      {vehicles.length < 5 && (
        <button
          onClick={onAdd}
          className="mb-4 px-4 py-2 bg-[var(--button-background)] text-[var(--button-text)] rounded hover:shadow-md"
        >
          Add Vehicle
        </button>
      )}
      
      <ul className="space-y-4">
        {vehicles.map((vehicle) => (
          <li
            key={vehicle.licensePlate}
            className="flex justify-between items-center p-4 bg-[var(--button-background)] rounded shadow"
          >
            <div>
              <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
              <p><strong>Model:</strong> {vehicle.model}</p>
              <p><strong>Type:</strong> {vehicle.vehicleType}</p>
            </div>
            <button
              onClick={() => onDelete(vehicle.licensePlate)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {vehicles.length === 0 && <p className="text-gray-500">No vehicles added yet.</p>}
    </div>
  );
};

export default Garage;
