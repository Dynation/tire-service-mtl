/*
  Warnings:

  - The values [SUV] on the enum `VehicleType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `slotCount` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VehicleType_new" AS ENUM ('SMALL_CAR', 'MEDIUM_CAR', 'TRUCK', 'ONE_SLOT', 'TWO_SLOTS');
ALTER TABLE "Vehicle" ALTER COLUMN "vehicleType" TYPE "VehicleType_new" USING ("vehicleType"::text::"VehicleType_new");
ALTER TABLE "Service" ALTER COLUMN "vehicleType" TYPE "VehicleType_new" USING ("vehicleType"::text::"VehicleType_new");
ALTER TYPE "VehicleType" RENAME TO "VehicleType_old";
ALTER TYPE "VehicleType_new" RENAME TO "VehicleType";
DROP TYPE "VehicleType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_licensePlate_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "slotCount" INTEGER NOT NULL;
