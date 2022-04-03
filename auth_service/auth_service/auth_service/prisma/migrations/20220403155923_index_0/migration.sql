-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone_id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phone" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "country_code" INTEGER NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_id_key" ON "User"("phone_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_phone_id_fkey" FOREIGN KEY ("phone_id") REFERENCES "Phone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
