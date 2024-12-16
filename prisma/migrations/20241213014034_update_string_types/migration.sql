/*
  Warnings:

  - You are about to alter the column `tireSize` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - A unique constraint covering the columns `[userId,plateNumber]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_vehicleId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "flatRun" SET DEFAULT false,
ALTER COLUMN "lowProfile" SET DEFAULT false,
ALTER COLUMN "tireSize" SET DATA TYPE VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_userId_plateNumber_key" ON "Vehicle"("userId", "plateNumber");
