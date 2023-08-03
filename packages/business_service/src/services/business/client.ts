import { BusinessUserRequestAccess, BusinessAddClient } from "types/services/business";
import { Days } from "@prisma/client";
import { prisma } from "config/prisma";
import { Pagination } from "type/pagination";
import { DocumentNotFoundError, UnknownError } from "utils/error";
import { getOffset } from "utils/pagination";
import { EventEmitterService } from "services/eventEmitter";

export class ClientService {
	id: number;
	user_id: string;
	id_user_id: { id: number; user_id: string };

	constructor({ id, user_id }: { id: number; user_id: string }) {
		this.id = id;
		this.user_id = user_id;
		this.id_user_id = {
			id,
			user_id,
		};
	}

	static requestAccess = async ({
		user_id,
		business_id,
		name,
		avatar_url,
	}: BusinessUserRequestAccess) => {
		try {
			const res = await prisma.business.update({
				data: {
					clients: {
						create: {
							avatar_url,
							user_id,
							has_access: false,
							has_priority: false,
							name,
							rate: -1,
							insights: {
								create: {
									last_appointment_taken: "",
								},
							},
						},
					},
				},
				where: { id: business_id },
			});
			if (!res) return Promise.reject(new DocumentNotFoundError());
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
	addClient = async ({ avatar_url, name, user_id, ...insights }: BusinessAddClient) => {
		try {
			const res = await prisma.business.update({
				data: {
					clients: {
						create: {
							user_id,
							avatar_url,
							name,
							has_priority: false,
							has_access: true,
							rate: -1,
							insights: {
								create: insights,
							},
						},
					},
				},
				where: { id_user_id: this.id_user_id },
			});
			if (!res) return Promise.reject(new DocumentNotFoundError());
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
	getAll = async (
		filter: { day?: Days; name?: string; service: string },
		pagination: Pagination
	) => {
		try {
			const result = await prisma.business.findUnique({
				select: {
					clients: {
						select: {
							appointments: {
								where: { day: filter.day, service: filter.service },
								orderBy: { arrive_time: "desc" },
							},
						},
						where: {
							name: filter.name,
						},
						skip: getOffset(pagination),
						take: pagination.size,
					},
				},
				where: { id: this.id },
			});
			if (!result) return Promise.reject(new DocumentNotFoundError());
			return result;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
	getClient = async (clientId: number) => {
		try {
			const result = await prisma.client.findUnique({ where: { id: clientId } });
			if (!result) return Promise.reject(new DocumentNotFoundError());
			return result;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
	getInsights = async (clientId: number) => {
		try {
			const result = await prisma.client.findUnique({
				select: { insights: true },
				where: { id: clientId },
			});
			if (!result) return Promise.reject(new DocumentNotFoundError());
			return result;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
	grantAccess = async (clientsId: number[]) => {
		try {
			const result = await prisma.business.update({
				data: {
					clients: {
						updateMany: {
							data: { has_access: true },
							where: { id: { in: clientsId } },
						},
					},
				},
				where: { id_user_id: this.id_user_id },
				select: { clients: { where: { id: { in: clientsId } } }, profile: true },
			});
			if (!result) return Promise.reject(new DocumentNotFoundError());
			//Send notification to user
			result.clients.forEach((client) => {
				EventEmitterService.business.clientAccessGranted({
					user_id: client.user_id,
					business_name: result.profile.name,
					access_granted: true,
				});
			});
			return result;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
	denyAccess = async (clientId: number) => {
		try {
			//Get the client first, so later we can send a notification to notify the deny
			const client = await prisma.client.findFirst({
				where: { id: clientId, business: { id: this.id, user_id: this.user_id } },
			});
			if (!client) return Promise.reject(new DocumentNotFoundError());
			//Delete the client
			const result = await prisma.business.update({
				data: {
					clients: { delete: { id: clientId } },
				},
				where: {
					id_user_id: this.id_user_id,
				},
				select: { profile: true },
			});
			if (!result) return Promise.reject(new DocumentNotFoundError());
			//Send notification to user
			EventEmitterService.business.clientAccessGranted({
				user_id: client.user_id,
				business_name: result.profile.name,
				access_granted: false,
			});
			return result;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
	remove = async (clientId: number) => {
		try {
			const result = await prisma.business.update({
				data: {
					clients: { delete: { id: clientId } },
				},
				where: {
					id_user_id: this.id_user_id,
				},
			});
			return result;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
	setPriority = async (clientId: number) => {
		try {
			const res = await prisma.business.update({
				data: {
					clients: { update: { data: { has_priority: true }, where: { id: clientId } } },
				},
				where: { id_user_id: this.id_user_id },
			});
			if (!res) return Promise.reject(new DocumentNotFoundError());
			return res;
		} catch (err) {
			return Promise.reject(err);
		}
	};
}
