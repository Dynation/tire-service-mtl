"use client";

import React, { useState } from "react";

interface TechnicianFormProps {
  startTime: string;
  onClose: () => void;
}

const TechnicianForm: React.FC<TechnicianFormProps> = ({ startTime, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [serviceType, setServiceType] = useState("TIRE_ROTATION");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Пошук клієнта
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`/api/clients?query=${searchQuery}`);
      if (!response.ok) throw new Error("Failed to fetch clients");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error searching clients:", error);
    }
  };

  const handleConfirmAppointment = async () => {
    if (!selectedClient || !selectedVehicle) {
      alert("Please select a client and a vehicle.");
      return;
    }

    setIsSubmitting(true);
    try {
      const appointmentData = {
        userId: selectedClient.uid,
        licensePlate: selectedVehicle.licensePlate,
        dateTime: startTime,
        type: serviceType,
        status: "CONFIRMED",
      };

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) throw new Error("Failed to create appointment");
      onClose(); // Закриваємо попап після успіху
    } catch (error) {
      console.error("Error confirming appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">📌 Створення запису</h2>

        {/* Пошук клієнта */}
        <input
          type="text"
          placeholder="Пошук за email / телефоном / номером авто"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded"
        >
          🔍 Пошук клієнта
        </button>

        {/* Відображення знайдених клієнтів */}
        {clients.length > 0 && (
          <div className="mt-2 border rounded p-2">
            {clients.map((client) => (
              <div
                key={client.uid}
                className={`p-2 cursor-pointer ${selectedClient?.uid === client.uid ? "bg-blue-200" : ""}`}
                onClick={() => setSelectedClient(client)}
              >
                {client.name} ({client.email})
              </div>
            ))}
          </div>
        )}

        {/* Вибір автомобіля */}
        {selectedClient && (
          <select
            className="mt-2 w-full border p-2 rounded"
            onChange={(e) => setSelectedVehicle(selectedClient.vehicles.find((v: any) => v.licensePlate === e.target.value))}
          >
            <option value="">🚗 Виберіть авто</option>
            {selectedClient.vehicles.map((vehicle: any) => (
              <option key={vehicle.licensePlate} value={vehicle.licensePlate}>
                {vehicle.model} ({vehicle.licensePlate})
              </option>
            ))}
          </select>
        )}

        {/* Вибір послуги */}
        <select
          className="mt-2 w-full border p-2 rounded"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        >
          <option value="TIRE_ROTATION">🔄 Tire Rotation</option>
          <option value="REPAIR_TIRE">🛠️ Tire Repair</option>
        </select>

        {/* Кнопки керування */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleConfirmAppointment}
            disabled={isSubmitting}
            className="w-full bg-green-500 text-white p-2 rounded"
          >
            {isSubmitting ? "Запис..." : "✅ Підтвердити запис"}
          </button>
          <button onClick={onClose} className="w-full bg-gray-400 text-white p-2 rounded">
            ❌ Скасувати
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianForm;
