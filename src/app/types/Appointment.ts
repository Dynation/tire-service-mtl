// src/types/Appointment.ts

import { VehicleType } from "./VehicleType";

export interface Appointment {
  id: string; // Унікальний ідентифікатор запису
  date: string; // ISO-строка дати, наприклад "2024-11-27"
  time: string; // Час у форматі "08:45 AM"
  serviceType: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"; // Статус запису
  vehicleType: VehicleType; // Тип транспортного засобу
  vehicleId: string; // Ідентифікатор транспортного засобу
}
