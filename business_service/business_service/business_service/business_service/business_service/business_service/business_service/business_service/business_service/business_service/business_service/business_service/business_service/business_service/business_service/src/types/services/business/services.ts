import { PaymentMethods, Service, ServiceSchedule, ServiceScheduleInterval } from "@prisma/client";

//===Services management type====
export type CreateServiceArgs = Omit<Service, "business_id" | "id" | "payment_methods_id"> & {
	payment_methods: Omit<PaymentMethods, "id">;
	business_id: string;
};

export type UpdateServiceArgs = Partial<Omit<Service, "business_id" | "id" | "payment_methods_id">>;

//====Service schedule types====
export type CreateSchedulesArgs = {
	service_id: string;
	business_id: string;
	schedules: (Omit<Partial<ServiceSchedule>, "id" | "service_id"> & {
		intervals: Omit<ServiceScheduleInterval, "id" | "service_schedule_id">[];
	})[];
};

export type UpdateServiceScheduleArgs = Omit<Partial<ServiceSchedule>, "id" | "service_id">;

export type DeleteScheduleArgs = {
	schedule_id: string;
};

//====Service intervals types====
export type CreateIntervalArgs = Omit<ServiceScheduleInterval, "id" | "service_schedule_id">[];

export type UpdateIntervalArgs = Omit<ServiceScheduleInterval, "service_schedule_id">;
