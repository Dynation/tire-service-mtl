/*
  Warnings:

  - You are about to drop the column `userId` on the `Appointment` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userUid,vehicleId,dateTime]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userUid` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userUid` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_userId_fkey";

-- DropIndex
DROP INDEX "Appointment_userId_vehicleId_dateTime_key";

-- DropIndex
DROP INDEX "Vehicle_userId_plateNumber_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "userId",
ADD COLUMN     "userUid" TEXT NOT NULL,
ALTER COLUMN "notes" SET DATA TYPE TEXT,
ALTER COLUMN "flatRun" DROP DEFAULT,
ALTER COLUMN "lowProfile" DROP DEFAULT,
ALTER COLUMN "tireSize" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "authProvider" TEXT NOT NULL DEFAULT 'firebase',
ADD COLUMN     "uid" TEXT NOT NULL,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "email" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "userId",
ADD COLUMN     "userUid" TEXT NOT NULL,
ALTER COLUMN "model" SET DATA TYPE TEXT,
ALTER COLUMN "plateNumber" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Service";

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_userUid_vehicleId_dateTime_key" ON "Appointment"("userUid", "vehicleId", "dateTime");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
