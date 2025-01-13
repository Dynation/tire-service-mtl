/*
  Warnings:

  - You are about to alter the column `name` on the `Service` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `flatRun` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `lowProfile` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `tireSize` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `wheelCount` on the `Vehicle` table. All the data in the column will be lost.
  - Added the required column `flatRun` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lowProfile` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tireSize` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wheelCount` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerTire` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "flatRun" BOOLEAN NOT NULL,
ADD COLUMN     "lowProfile" BOOLEAN NOT NULL,
ADD COLUMN     "tireSize" TEXT NOT NULL,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "wheelCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "description" VARCHAR(255) NOT NULL,
ADD COLUMN     "extraOption" BOOLEAN,
ADD COLUMN     "pricePerTire" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "vehicleType" "VehicleType",
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "flatRun",
DROP COLUMN "lowProfile",
DROP COLUMN "tireSize",
DROP COLUMN "wheelCount";
