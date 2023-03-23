import { getOffset } from "utils/pagination";
import { Pagination } from "type/pagination";
import { UnknownError, DocumentNotFoundError } from "utils/errors";
import { CreateEmployeeArgs, UpdateEmployeeArgs } from "type/services/business/employees";
import { prisma } from "config/prisma";
import { FileStorageService } from "services/storage";

export class BusinessEmployeesService {
	employee_id: string;
	business_id: string;

	constructor({ employee_id, business_id }: { employee_id: string; business_id: string }) {
		this.employee_id = employee_id;
		this.business_id = business_id;
	}

	static create = async ({ business_id, avatar, ...data }: CreateEmployeeArgs) => {
		try {
			let avatar_url = "";
			if (avatar) {
				const res = await FileStorageService.upload([
					{ base64: avatar.base_64, mimetype: avatar.mimetype, public: true },
				]);
				avatar_url = res[0];
			}
			await prisma.business.update({
				data: { employees: { create: { ...data, avatar_url } } },
				where: { id: business_id },
			});
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	static getAll = async (business_id: string) => {
		try {
			const business = await prisma.business.findUnique({
				select: { employees: { include: { services: { select: { id: true } } } } },
				where: { id: business_id },
			});
			if (!business) return Promise.reject(new DocumentNotFoundError());
			return business.employees;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	get = async () => {
		try {
			const business = await prisma.business.findUnique({
				select: {
					employees: {
						include: {
							schedules: { include: { intervals: true } },
							services: { select: { id: true } },
						},
						where: { id: this.employee_id },
					},
				},
				where: { id: this.business_id },
			});
			if (!business || !business.employees[0])
				return Promise.reject(new DocumentNotFoundError());
			return business.employees[0];
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	getAppointmentsHistory = async (pagination: Pagination) => {
		try {
			const business = await prisma.business.findUnique({
				select: {
					employees: {
						select: {
							appointments: {
								include: {
									client: true,
									appointment_updated: true,
									service: { select: { id: true } },
								},
								skip: getOffset(pagination),
								take: pagination.size,
							},
						},
						where: { id: this.employee_id },
					},
				},
				where: { id: this.business_id },
			});
			if (!business || !business.employees[0])
				return Promise.reject(new DocumentNotFoundError());
			return business.employees[0].appointments;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	update = async ({ avatar, ...data }: UpdateEmployeeArgs) => {
		try {
			let avatar_url: string | undefined;
			if (avatar) {
				const res = await FileStorageService.upload([
					{ base64: avatar.base_64, mimetype: avatar.mimetype, public: true },
				]);
				avatar_url = res[0];
			}
			await prisma.business.update({
				data: {
					employees: {
						update: { data: { ...data, avatar_url }, where: { id: this.employee_id } },
					},
				},
				where: { id: this.business_id },
			});
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	delete = async () => {
		try {
			await prisma.business.update({
				data: { employees: { delete: { id: this.employee_id } } },
				where: { id: this.business_id },
			});
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};
}
