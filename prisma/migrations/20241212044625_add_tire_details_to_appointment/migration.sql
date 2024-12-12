-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "flatRun" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lowProfile" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tireSize" VARCHAR(50),
ADD COLUMN     "wheelCount" INTEGER;
