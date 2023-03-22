-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('CANCELED', 'PENDING', 'ACTIVE');

-- CreateEnum
CREATE TYPE "Days" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "TimeOfTheDay" AS ENUM ('MORNING', 'NOON', 'AFTERNOON', 'EVENING', 'NIGHT');

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "day" "Days" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "arrive_time" TIMESTAMP(3) NOT NULL,
    "leave_time" TIMESTAMP(3) NOT NULL,
    "time_of_the_day" "TimeOfTheDay" NOT NULL,
    "pays_with" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL,
    "client_did_not_go" BOOLEAN NOT NULL,
    "canceled_by_business" BOOLEAN NOT NULL,
    "canceled_by_client" BOOLEAN NOT NULL,
    "client_arrived_late" BOOLEAN NOT NULL,
    "client_updated_time" BOOLEAN NOT NULL,
    "service_id" INTEGER NOT NULL,
    "employee_id" TEXT NOT NULL,
    "client_id" INTEGER NOT NULL,
    "business_id" TEXT NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentUpdated" (
    "id" SERIAL NOT NULL,
    "old_arrive_time" TIMESTAMP(3) NOT NULL,
    "old_leave_time" TIMESTAMP(3) NOT NULL,
    "appointment_id" INTEGER NOT NULL,

    CONSTRAINT "AppointmentUpdated_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "settings_id" INTEGER NOT NULL,
    "location_id" INTEGER NOT NULL,
    "payment_methods_id" INTEGER NOT NULL,
    "branch_id" INTEGER NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "client_insights_id" INTEGER NOT NULL,
    "business_id" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientInsights" (
    "id" SERIAL NOT NULL,
    "first_appointment_taken" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_appointment_taken" TIMESTAMP(3) NOT NULL,
    "appointments" INTEGER NOT NULL DEFAULT 0,
    "appointments_taken" INTEGER NOT NULL DEFAULT 0,
    "appointments_canceled" INTEGER NOT NULL DEFAULT 0,
    "times_arrived_late" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ClientInsights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeSchedule" (
    "id" SERIAL NOT NULL,
    "day" "Days",
    "month" INTEGER,
    "day_number" INTEGER,
    "date" TIMESTAMP(3),
    "employee_id" TEXT NOT NULL,

    CONSTRAINT "EmployeeSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeScheduleInterval" (
    "id" SERIAL NOT NULL,
    "starts_at" DOUBLE PRECISION NOT NULL,
    "ends_at" DOUBLE PRECISION NOT NULL,
    "employee_schedule_id" INTEGER NOT NULL,

    CONSTRAINT "EmployeeScheduleInterval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
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
    "price" DOUBLE PRECISION NOT NULL,
    "price_currency" TEXT NOT NULL,
    "is_discount" BOOLEAN NOT NULL,
    "discount_price" DOUBLE PRECISION NOT NULL,
    "appointments_frequency_in_minutes" DOUBLE PRECISION NOT NULL,
    "max_appointments_anticipation_in_days" DOUBLE PRECISION NOT NULL,
    "min_appointments_anticipation_in_days" DOUBLE PRECISION NOT NULL,
    "max_concurrent_appointments" DOUBLE PRECISION NOT NULL,
    "business_id" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceSchedule" (
    "id" SERIAL NOT NULL,
    "day" "Days",
    "month" INTEGER,
    "day_number" INTEGER,
    "date" TIMESTAMP(3),
    "service_id" INTEGER NOT NULL,

    CONSTRAINT "ServiceSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceScheduleInterval" (
    "id" SERIAL NOT NULL,
    "starts_at" DOUBLE PRECISION NOT NULL,
    "ends_at" DOUBLE PRECISION NOT NULL,
    "service_schedule_id" INTEGER NOT NULL,

    CONSTRAINT "ServiceScheduleInterval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,

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
CREATE TABLE "_EmployeeToService" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_id_key" ON "Appointment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentUpdated_id_key" ON "AppointmentUpdated"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentUpdated_appointment_id_key" ON "AppointmentUpdated"("appointment_id");

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
CREATE UNIQUE INDEX "Client_id_key" ON "Client"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_client_insights_id_key" ON "Client"("client_insights_id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_business_id_key" ON "Client"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "ClientInsights_id_key" ON "ClientInsights"("id");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeSchedule_employee_id_day_key" ON "EmployeeSchedule"("employee_id", "day");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeSchedule_employee_id_day_number_month_key" ON "EmployeeSchedule"("employee_id", "day_number", "month");

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
CREATE UNIQUE INDEX "ServiceSchedule_service_id_day_key" ON "ServiceSchedule"("service_id", "day");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceSchedule_service_id_day_number_month_key" ON "ServiceSchedule"("service_id", "day_number", "month");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_id_key" ON "Settings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_id_key" ON "Verification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_settings_id_key" ON "Verification"("settings_id");

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeToService_AB_unique" ON "_EmployeeToService"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeToService_B_index" ON "_EmployeeToService"("B");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentUpdated" ADD CONSTRAINT "AppointmentUpdated_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "Settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_payment_methods_id_fkey" FOREIGN KEY ("payment_methods_id") REFERENCES "PaymentMethods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_client_insights_id_fkey" FOREIGN KEY ("client_insights_id") REFERENCES "ClientInsights"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeSchedule" ADD CONSTRAINT "EmployeeSchedule_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeScheduleInterval" ADD CONSTRAINT "EmployeeScheduleInterval_employee_schedule_id_fkey" FOREIGN KEY ("employee_schedule_id") REFERENCES "EmployeeSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OtherPayments" ADD CONSTRAINT "OtherPayments_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "PaymentMethods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceSchedule" ADD CONSTRAINT "ServiceSchedule_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceScheduleInterval" ADD CONSTRAINT "ServiceScheduleInterval_service_schedule_id_fkey" FOREIGN KEY ("service_schedule_id") REFERENCES "ServiceSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "Settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToService" ADD CONSTRAINT "_EmployeeToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToService" ADD CONSTRAINT "_EmployeeToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
