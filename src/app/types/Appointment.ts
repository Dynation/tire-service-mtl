// src/types/Appointment.ts

import { VehicleType } from "./VehicleType";
import { ServiceType } from "@prisma/client";

export interface Appointment {
  id: string; // Унікальний ідентифікатор запису
  dateTime: string; // ISO-строка дати, наприклад "2024-11-27"
  type: ServiceType;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"; // Статус запису
  licensePlate : string; // Номерний знак транспортного засобу
  vehicleType: VehicleType; // Тип транспортного засобу
  vehicleId: string; // Ідентифікатор транспортного засобу
  notes: string | null; // Додаткові примітки
}
