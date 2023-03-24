import {
	CreateIntervalArgs,
	UpdateIntervalArgs,
	CreateSchedulesArgs,
	UpdateServiceScheduleArgs,
} from "types/services/business/services";
import { getBusinessServiceSchedule, intervalsInvalidError, verifyIntervals } from "./helpers";
import { UnknownError } from "utils/errors";
import { prisma } from "config/prisma";

interface Constructor {
	business_id: string;
	schedule_id: string;
	service_id: string;
}

export class BusinessServiceScheduleService implements Constructor {
	business_id;
	schedule_id;
	service_id;

	constructor({ schedule_id, business_id, service_id }: Constructor) {
		this.schedule_id = schedule_id;
		this.business_id = business_id;
		this.service_id = service_id;
	}

	static createSchedule = async ({ schedules, service_id, business_id }: CreateSchedulesArgs) => {
		const areIntervalsValid = schedules.every((schedule) =>
			verifyIntervals(schedule.intervals)
		);
		if (!areIntervalsValid) return Promise.reject(intervalsInvalidError);
		await prisma.business.update({
			data: {
				services: {
					update: {
						data: {
							schedules: {
								create: schedules.map(({ intervals, ...schedule }) => ({
									...schedule,
									intervals: { create: intervals },
								})),
							},
						},
						where: { id: service_id },
					},
				},
			},
			where: { id: business_id },
		});
		return;
	};

	updateSchedule = async (data: UpdateServiceScheduleArgs) => {
		try {
			await prisma.business.update({
				data: {
					services: {
						update: {
							data: {
								schedules: {
									update: {
										data,
										where: { id: this.schedule_id },
									},
								},
							},
							where: { id: this.service_id },
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
					services: {
						update: {
							data: { schedules: { delete: { id: this.schedule_id } } },
							where: { id: this.service_id },
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
			const schedule = await getBusinessServiceSchedule({
				schedule_id: this.schedule_id,
				business_id: this.business_id,
				service_id: this.service_id,
			});
			const areIntervalsValid = verifyIntervals([...schedule.intervals, ...intervals]);
			if (!areIntervalsValid) return Promise.reject(intervalsInvalidError);
			const res = await prisma.serviceSchedule.update({
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
			const schedule = await getBusinessServiceSchedule({
				schedule_id: this.schedule_id,
				business_id: this.business_id,
				service_id: this.service_id,
			});
			const areIntervalsValid = verifyIntervals([
				//Filter the one to update
				...schedule.intervals.filter((interval) => interval.id === id),
				data,
			]);
			if (!areIntervalsValid) return Promise.reject(intervalsInvalidError);
			//Everything is fine, update the interval
			const res = await prisma.serviceScheduleInterval.update({
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
					services: {
						update: {
							data: {
								schedules: {
									update: {
										data: { intervals: { delete: { id } } },
										where: { id: this.schedule_id },
									},
								},
							},
							where: { id: this.service_id },
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
