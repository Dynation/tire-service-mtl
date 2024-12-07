/*
  Warnings:

  - You are about to drop the column `vehicleType` on the `Appointment` table. All the data in the column will be lost.
  - You are about to alter the column `notes` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `description` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - A unique constraint covering the columns `[userId,vehicleId,dateTime]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vehicleId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_userId_dateTime_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "vehicleType",
ADD COLUMN     "vehicleId" INTEGER NOT NULL,
ALTER COLUMN "notes" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "plateNumber" VARCHAR(10) NOT NULL,
    "vehicleType" "VehicleType" NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plateNumber_key" ON "Vehicle"("plateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_userId_plateNumber_key" ON "Vehicle"("userId", "plateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_userId_vehicleId_dateTime_key" ON "Appointment"("userId", "vehicleId", "dateTime");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
