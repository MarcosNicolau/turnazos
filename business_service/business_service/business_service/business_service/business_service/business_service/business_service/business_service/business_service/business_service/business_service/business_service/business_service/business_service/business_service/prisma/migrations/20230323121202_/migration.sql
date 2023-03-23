/*
  Warnings:

  - You are about to drop the column `payment_methods_id` on the `Business` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[payment_methods_id]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `payment_methods_id` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requires_business_confirmation` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_in_minutes` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_payment_methods_id_fkey";

-- DropIndex
DROP INDEX "Business_payment_methods_id_key";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "payment_methods_id";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "payment_methods_id" INTEGER NOT NULL,
ADD COLUMN     "requires_business_confirmation" BOOLEAN NOT NULL,
ADD COLUMN     "time_in_minutes" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Service_payment_methods_id_key" ON "Service"("payment_methods_id");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_payment_methods_id_fkey" FOREIGN KEY ("payment_methods_id") REFERENCES "PaymentMethods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
