/*
  Warnings:

  - A unique constraint covering the columns `[id,user_id]` on the table `Business` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Business_id_user_id_key" ON "Business"("id", "user_id");
