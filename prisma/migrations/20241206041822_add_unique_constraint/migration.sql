/*
  Warnings:

  - You are about to drop the column `notes` on the `Service` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,price]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "notes";

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_price_key" ON "Service"("name", "price");
