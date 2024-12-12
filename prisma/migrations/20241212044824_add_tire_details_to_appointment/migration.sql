/*
  Warnings:

  - Made the column `tireSize` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `wheelCount` on table `Appointment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "tireSize" SET NOT NULL,
ALTER COLUMN "wheelCount" SET NOT NULL;
