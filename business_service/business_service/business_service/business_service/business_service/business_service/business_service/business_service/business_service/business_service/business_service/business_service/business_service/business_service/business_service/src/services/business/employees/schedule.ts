import {
	CreateIntervalArgs,
	UpdateIntervalArgs,
	CreateSchedulesArgs,
	UpdateEmployeeScheduleArgs,
} from "types/services/business/employees";
import { getBusinessEmployeeSchedule, intervalsInvalidError, verifyIntervals } from "./helpers";
import { UnknownError } from "utils/errors";
import { prisma } from "config/prisma";

interface Constructor {
	business_id: string;
	employee_id: string;
	schedule_id: string;
}

export class BusinessEmployeeSchedulesEmployee implements Constructor {
	business_id;
	employee_id;
	schedule_id;

	constructor({ business_id, employee_id, schedule_id }: Constructor) {
		this.business_id = business_id;
		this.employee_id = employee_id;
		this.schedule_id = schedule_id;
	}

	static createSchedule = async ({
		schedules,
		employee_id,
		business_id,
	}: CreateSchedulesArgs) => {
		const areIntervalsValid = schedules.every((schedule) =>
			verifyIntervals(schedule.intervals)
		);
		if (!areIntervalsValid) return Promise.reject(intervalsInvalidError);
		await prisma.business.update({
			data: {
				employees: {
					update: {
						data: {
							schedules: {
								create: schedules.map(({ intervals, ...schedule }) => ({
									...schedule,
									intervals: { create: intervals },
								})),
							},
						},
						where: { id: employee_id },
					},
				},
			},
			where: { id: business_id },
		});
		return;
	};

	updateSchedule = async (data: UpdateEmployeeScheduleArgs) => {
		try {
			await prisma.business.update({
				data: {
					employees: {
						update: {
							data: {
								schedules: {
									update: {
										data,
										where: { id: this.schedule_id },
									},
								},
							},
							where: { id: this.employee_id },
						},
					},
				},
				where: { id: this.business_id },
			});
		} catch (err) {
			return Promise.reject(err);
		}
	};

	deleteSchedule = async () => {
		try {
			await prisma.business.update({
				data: {
					employees: {
						update: {
							data: { schedules: { delete: { id: this.schedule_id } } },
							where: { id: this.employee_id },
						},
					},
				},
				where: { id: this.business_id },
			});
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	createInterval = async (intervals: CreateIntervalArgs) => {
		try {
			const schedule = await getBusinessEmployeeSchedule({
				schedule_id: this.schedule_id,
				business_id: this.business_id,
				employee_id: this.employee_id,
			});
			const areIntervalsValid = verifyIntervals([...schedule.intervals, ...intervals]);
			if (!areIntervalsValid) return Promise.reject(intervalsInvalidError);
			const res = await prisma.employeeSchedule.update({
				data: { intervals: { createMany: { data: intervals } } },
				where: { id: this.schedule_id },
			});
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	updateInterval = async ({ id, ...data }: UpdateIntervalArgs) => {
		try {
			const schedule = await getBusinessEmployeeSchedule({
				schedule_id: this.schedule_id,
				business_id: this.business_id,
				employee_id: this.employee_id,
			});
			const areIntervalsValid = verifyIntervals([
				//Filter the one to update
				...schedule.intervals.filter((interval) => interval.id === id),
				data,
			]);
			if (!areIntervalsValid) return Promise.reject(intervalsInvalidError);
			//Everything is fine, update the interval
			const res = await prisma.employeeScheduleInterval.update({
				data,
				where: { id },
			});
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	deleteInterval = async (id: string) => {
		try {
			await prisma.business.update({
				data: {
					employees: {
						update: {
							data: {
								schedules: {
									update: {
										data: { intervals: { delete: { id } } },
										where: { id: this.schedule_id },
									},
								},
							},
							where: { id: this.employee_id },
						},
					},
				},
				where: { id: this.business_id },
			});
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
}
