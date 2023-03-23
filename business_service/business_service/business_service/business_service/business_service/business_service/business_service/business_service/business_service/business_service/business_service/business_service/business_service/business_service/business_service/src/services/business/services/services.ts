import { DocumentNotFoundError, UnknownError } from "utils/errors";
import { CreateServiceArgs, UpdateServiceArgs } from "type/services/business/services";
import { prisma } from "config/prisma";
import { Pagination } from "type/pagination";
import { getOffset } from "utils/pagination";

export class BusinessServicesService {
	service_id: number;

	constructor({ service_id }: { service_id: number }) {
		this.service_id = service_id;
	}

	static create = async ({ payment_methods, business_id, ...data }: CreateServiceArgs) => {
		try {
			const res = await prisma.service.create({
				data: {
					...data,
					business: { connect: { id: business_id } },
					payment_methods: { create: payment_methods },
				},
			});
			return res;
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
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	get = async () => {
		try {
			const service = await prisma.service.findUnique({
				where: { id: this.service_id },
				include: {
					schedules: { include: { intervals: true } },
					employees: { select: { id: true } },
				},
			});
			if (!service) return Promise.reject(new DocumentNotFoundError());
			return service;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	getServiceAppointmentHistory = async (pagination: Pagination) => {
		try {
			const service = await prisma.service.findUnique({
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
			});
			if (!service) return Promise.reject(new DocumentNotFoundError());
			return service.appointments;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	update = async (data: UpdateServiceArgs) => {
		try {
			const service = await prisma.service.update({
				data,
				where: { id: this.service_id },
			});
			return service;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	delete = async () => {
		try {
			const service = await prisma.service.delete({ where: { id: this.service_id } });
			return service;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};
}
