/*
  Warnings:

  - You are about to drop the column `flatRun` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `lowProfile` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `tireSize` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `wheelCount` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `flatRun` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lowProfile` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tireSize` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wheelCount` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "flatRun",
DROP COLUMN "lowProfile",
DROP COLUMN "tireSize",
DROP COLUMN "wheelCount";

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "flatRun" BOOLEAN NOT NULL,
ADD COLUMN     "lowProfile" BOOLEAN NOT NULL,
ADD COLUMN     "tireSize" VARCHAR(10) NOT NULL,
ADD COLUMN     "wheelCount" INTEGER NOT NULL;
