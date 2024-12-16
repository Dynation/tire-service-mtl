-- DropIndex
DROP INDEX "Vehicle_userId_plateNumber_key";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "flatRun" DROP DEFAULT,
ALTER COLUMN "lowProfile" DROP DEFAULT,
ALTER COLUMN "tireSize" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
