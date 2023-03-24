import { prisma } from "config/prisma";
import { AppError, DocumentNotFoundError } from "utils/errors";

export const verifyIntervals = async (
	intervals: {
		starts_at: number;
		ends_at: number;
	}[]
) => {
	const isValid = intervals.every(({ ends_at, starts_at }) => {
		//First, make sure that the values are withinh the 24 hour range
		if (starts_at < 0 || starts_at > 24 || ends_at < 0 || ends_at > 24) return;
		//Then make sure that the interval does not fall into any other interval
		const interposes = intervals.some(
			(interval) => starts_at > interval.starts_at && ends_at < interval.ends_at
		);
		return !interposes;
	});
	return isValid;
};

export const intervalsInvalidError = new AppError({ httpCode: 400, message: "invalid intervals" });

interface GetBusinessServiceScheduleArgs {
	schedule_id: string;
	service_id: string;
	business_id: string;
}

export const getBusinessServiceSchedule = async ({
	business_id,
	schedule_id,
	service_id,
}: GetBusinessServiceScheduleArgs) => {
	const business = await prisma.business.findUnique({
		select: {
			services: {
				select: {
					schedules: {
						select: { intervals: true },
						where: { id: schedule_id },
					},
				},
				where: { id: service_id },
			},
		},
		where: { id: business_id },
	});
	if (!business || !business.services[0] || !business.services[0].schedules[0])
		return Promise.reject(new DocumentNotFoundError());
	return business.services[0].schedules[0];
};
