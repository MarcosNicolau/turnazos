import { DocumentNotFoundError, UnknownError } from "utils/errors";
import { CreateServiceArgs, UpdateServiceArgs } from "type/services/business/services";
import { prisma } from "config/prisma";
import { Pagination } from "type/pagination";
import { getOffset } from "utils/pagination";

export class BusinessServicesService {
	service_id: number;
	business_id: string;

	constructor({ service_id, business_id }: { service_id: number; business_id: string }) {
		this.service_id = service_id;
		this.business_id = business_id;
	}

	static create = async ({ payment_methods, business_id, ...data }: CreateServiceArgs) => {
		try {
			await prisma.business.update({
				data: {
					services: {
						create: {
							...data,
							payment_methods: { create: payment_methods },
						},
					},
				},
				where: { id: business_id },
			});
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	static getAll = async (business_id: string) => {
		try {
			const res = await prisma.business.findUnique({
				select: {
					services: true,
				},
				where: { id: business_id },
			});
			if (!res) return Promise.reject(new DocumentNotFoundError());
			return res.services;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	get = async () => {
		try {
			const business = await prisma.business.findUnique({
				select: {
					services: {
						include: {
							schedules: { include: { intervals: true } },
							payment_methods: { include: { other_payments: true } },
						},
						where: { id: this.service_id },
					},
				},
				where: { id: this.business_id },
			});
			if (!business || !business.services[0])
				return Promise.reject(new DocumentNotFoundError());
			return business.services[0];
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	getServiceAppointmentHistory = async (pagination: Pagination) => {
		try {
			const business = await prisma.business.findUnique({
				select: {
					services: {
						select: {
							appointments: {
								include: {
									employee: { select: { id: true } },
									appointment_updated: true,
									client: true,
								},
								skip: getOffset(pagination),
								take: pagination.size,
							},
						},
						where: { id: this.service_id },
					},
				},
				where: { id: this.business_id },
			});
			if (!business || !business.services[0])
				return Promise.reject(new DocumentNotFoundError());
			return business.services[0].appointments;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	update = async (data: UpdateServiceArgs) => {
		try {
			await prisma.business.update({
				data: { services: { update: { data, where: { id: this.service_id } } } },
				where: { id: this.business_id },
			});
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	delete = async () => {
		try {
			await prisma.business.update({
				data: { services: { delete: { id: this.service_id } } },
				where: { id: this.business_id },
			});
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};
}
