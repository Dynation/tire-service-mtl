import { VehicleType } from "./VehicleType"; // Якщо `VehicleType` зберігається окремо
import { Appointment } from "./Appointment"; // Тип для Appointment

export interface Vehicle {
  licensePlate: string; // Унікальний номер авто (первинний ключ)
  userId: string; // UID користувача
  model: string; // Модель транспортного засобу
  vehicleType: VehicleType; // Тип транспортного засобу (SMALL_CAR, SUV, TRUCK)
  appointments?: Appointment[]; // Зв'язок з записами
}
