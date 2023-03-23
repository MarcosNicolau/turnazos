import {
	CreateIntervalArgs,
	UpdateIntervalArgs,
	CreateSchedulesArgs,
	UpdateServiceScheduleArgs,
} from "types/services/business/services";
import { intervalsInvalidError, verifyIntervals } from "./helpers";
import { DocumentNotFoundError, UnknownError } from "utils/errors";
import { prisma } from "config/prisma";

export class BusinessServiceScheduleService {
	schedule_id: number;

	constructor({ schedule_id }: { schedule_id: number }) {
		this.schedule_id = schedule_id;
	}

	static createSchedule = async ({ schedules, service_id }: CreateSchedulesArgs) => {
		const areIntervalsValid = schedules.every((schedule) =>
			verifyIntervals(schedule.intervals)
		);
		if (!areIntervalsValid) return Promise.reject(intervalsInvalidError);
		const service = await prisma.service.findUnique({ where: { id: service_id } });
		//Verify that the service actually exists
		if (!service) return Promise.reject(new DocumentNotFoundError());
		//Create the schedule
		for await (const { intervals, ...data } of schedules) {
			await prisma.serviceSchedule.create({
				data: {
					...data,
					service: { connect: { id: service.id } },
					intervals: { createMany: { data: intervals } },
				},
			});
		}
	};

	updateSchedule = async (data: UpdateServiceScheduleArgs) => {
		try {
			const res = await prisma.serviceSchedule.update({
				data,
				where: { id: this.schedule_id },
			});
			return res;
		} catch (err) {
			return Promise.reject(err);
		}
	};

	deleteSchedule = async () => {
		try {
			const res = await prisma.serviceSchedule.delete({ where: { id: this.schedule_id } });
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	createInterval = async (intervals: CreateIntervalArgs) => {
		try {
			//Get all the intervals to verify
			const serviceSchedule = await prisma.serviceSchedule.findUnique({
				include: { intervals: true },
				where: { id: this.schedule_id },
			});
			if (!serviceSchedule) return Promise.reject(new DocumentNotFoundError());
			const areIntervalsValid = verifyIntervals(intervals);
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
			//Get all the intervals to verify
			const serviceSchedule = await prisma.serviceSchedule.findUnique({
				include: { intervals: true },
				where: { id: this.schedule_id },
			});
			if (!serviceSchedule) return Promise.reject(new DocumentNotFoundError());
			const areIntervalsValid = verifyIntervals([
				//Remove the one to update
				...serviceSchedule.intervals.filter((interval) => interval.id === id),
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

	static deleteInterval = async (id: number) => {
		try {
			const res = await prisma.serviceScheduleInterval.delete({ where: { id } });
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
}
