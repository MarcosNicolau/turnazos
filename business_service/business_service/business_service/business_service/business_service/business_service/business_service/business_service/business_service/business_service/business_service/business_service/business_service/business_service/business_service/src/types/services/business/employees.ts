import { Employee, EmployeeSchedule, EmployeeScheduleInterval } from "@prisma/client";

export type CreateEmployeeArgs = Omit<Employee, "id" | "avatar_url"> & {
	avatar?: { base_64: string; mimetype: string };
};

export type UpdateEmployeeArgs = Partial<Omit<CreateEmployeeArgs, "business_id">>;

//====Employee schedule types====
export type CreateSchedulesArgs = {
	employee_id: string;
	business_id: string;
	schedules: (Omit<Partial<EmployeeSchedule>, "id" | "employee_id"> & {
		intervals: Omit<EmployeeScheduleInterval, "id" | "service_schedule_id">[];
	})[];
};

export type UpdateEmployeeScheduleArgs = Omit<Partial<EmployeeSchedule>, "id" | "employee_id">;

export type DeleteScheduleArgs = {
	schedule_id: number;
};

//====Employee intervals types====
export type CreateIntervalArgs = Omit<EmployeeScheduleInterval, "id" | "service_schedule_id">[];

export type UpdateIntervalArgs = Omit<EmployeeScheduleInterval, "service_schedule_id">;
