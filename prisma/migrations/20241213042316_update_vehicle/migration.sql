/*
  Warnings:

  - You are about to drop the column `userUid` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to alter the column `notes` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - The primary key for the `Vehicle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `plateNumber` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `userUid` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to alter the column `model` on the `Vehicle` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - A unique constraint covering the columns `[userId,licensePlate,dateTime]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `licensePlate` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `licensePlate` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userUid_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_userUid_fkey";

-- DropIndex
DROP INDEX "Appointment_userUid_vehicleId_dateTime_key";

-- DropIndex
DROP INDEX "Vehicle_plateNumber_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "userUid",
DROP COLUMN "vehicleId",
ADD COLUMN     "licensePlate" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "notes" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_pkey",
DROP COLUMN "id",
DROP COLUMN "plateNumber",
DROP COLUMN "userUid",
ADD COLUMN     "licensePlate" VARCHAR(10) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "model" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_userId_licensePlate_dateTime_key" ON "Appointment"("userId", "licensePlate", "dateTime");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_licensePlate_fkey" FOREIGN KEY ("licensePlate") REFERENCES "Vehicle"("licensePlate") ON DELETE RESTRICT ON UPDATE CASCADE;
