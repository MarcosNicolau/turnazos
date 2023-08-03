-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "settings_id" INTEGER NOT NULL,
    "location_id" INTEGER NOT NULL,
    "payment_methods_id" INTEGER NOT NULL,
    "branch_id" INTEGER NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id","user_id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "is_branch" BOOLEAN NOT NULL,
    "headquarters_id" INTEGER NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "has_priority" BOOLEAN NOT NULL,
    "first_interaction" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "business_id" INTEGER NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "lon" INTEGER NOT NULL,
    "lat" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethods" (
    "id" SERIAL NOT NULL,
    "cash" BOOLEAN NOT NULL,
    "credit_card" BOOLEAN NOT NULL,
    "debit_card" BOOLEAN NOT NULL,
    "cryptocurrency" BOOLEAN NOT NULL,
    "wire_transfer" BOOLEAN NOT NULL,
    "mercado_pago" BOOLEAN NOT NULL,
    "cvu" BOOLEAN NOT NULL,

    CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtherPayments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "payment_id" INTEGER NOT NULL,

    CONSTRAINT "OtherPayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "slogan" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,
    "cover_url" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "cost_level" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "profile_id" INTEGER NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "price_currency" TEXT NOT NULL,
    "business_id" INTEGER NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "branch_share_clients" BOOLEAN NOT NULL,
    "private" BOOLEAN NOT NULL,
    "hidden" BOOLEAN NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "is_verified" BOOLEAN NOT NULL,
    "verification_status" TEXT NOT NULL,
    "documentation_url" TEXT NOT NULL,
    "settings_id" INTEGER NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationKeys" (
    "id" SERIAL NOT NULL,
    "keys_duration" INTEGER NOT NULL,
    "customers_can_invitate" BOOLEAN NOT NULL,
    "settings_id" INTEGER NOT NULL,

    CONSTRAINT "InvitationKeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvitationKey" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "invitation_config_id" INTEGER NOT NULL,

    CONSTRAINT "InvitationKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_id_key" ON "Business"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Business_profile_id_key" ON "Business"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "Business_settings_id_key" ON "Business"("settings_id");

-- CreateIndex
CREATE UNIQUE INDEX "Business_location_id_key" ON "Business"("location_id");

-- CreateIndex
CREATE UNIQUE INDEX "Business_payment_methods_id_key" ON "Business"("payment_methods_id");

-- CreateIndex
CREATE UNIQUE INDEX "Business_branch_id_key" ON "Business"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_id_key" ON "Branch"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_key" ON "Client"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_business_id_key" ON "Client"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_id_key" ON "Location"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethods_id_key" ON "PaymentMethods"("id");

-- CreateIndex
CREATE UNIQUE INDEX "OtherPayments_id_key" ON "OtherPayments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_key" ON "Profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Gallery_id_key" ON "Gallery"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Service_id_key" ON "Service"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Service_business_id_name_key" ON "Service"("business_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_id_key" ON "Settings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_id_key" ON "Verification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_settings_id_key" ON "Verification"("settings_id");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationKeys_id_key" ON "InvitationKeys"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationKeys_settings_id_key" ON "InvitationKeys"("settings_id");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationKey_id_key" ON "InvitationKey"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationKey_key_key" ON "InvitationKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "InvitationKey_invitation_config_id_key" ON "InvitationKey"("invitation_config_id");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "Settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_payment_methods_id_fkey" FOREIGN KEY ("payment_methods_id") REFERENCES "PaymentMethods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherPayments" ADD CONSTRAINT "OtherPayments_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "PaymentMethods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "Settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationKeys" ADD CONSTRAINT "InvitationKeys_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "Settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvitationKey" ADD CONSTRAINT "InvitationKey_invitation_config_id_fkey" FOREIGN KEY ("invitation_config_id") REFERENCES "InvitationKeys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
