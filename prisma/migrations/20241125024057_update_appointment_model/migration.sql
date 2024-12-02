/*
  Warnings:

  - Added the required column `vehicleType` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('SMALL_CAR', 'SUV', 'TRUCK');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "vehicleType" "VehicleType" NOT NULL;
