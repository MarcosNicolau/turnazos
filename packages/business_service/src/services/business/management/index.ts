import { prisma } from "config/prisma";
import { createLocation } from "services/business/management/helpers";
import { CreateBusiness, UpdateBusiness } from "type/services/business";
import { DocumentNotFoundError, UnknownError } from "utils/error";

export class BusinessManagementService {
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

	static create = async ({
		location: coords,
		profile,
		settings,
		user_id,
		payment_methods,
	}: CreateBusiness) => {
		try {
			//Get location details from navigation service
			const location = await createLocation(coords);
			const res = await prisma.business.create({
				data: {
					user_id,
					branches: { create: {} },
					location: { create: location },
					settings: { create: settings },
					profile: { create: profile },
					payment_methods: { create: payment_methods },
				},
			});
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};

	createBranch = async ({
		location: coords,
		profile,
		settings,
		user_id,
		payment_methods,
	}: CreateBusiness) => {
		try {
			//To create a branch, we must get the branches table from the already created business
			//And then we connect the new business to the same table so we can relate all the branches
			const business = await prisma.business.findUnique({
				where: { id_user_id: this.id_user_id },
			});
			if (!business) return Promise.reject(new DocumentNotFoundError());
			const location = await createLocation(coords);
			const res = await prisma.business.create({
				data: {
					user_id,
					branches: { connect: { id: business.branches_id } },
					location: { create: location },
					settings: { create: settings },
					profile: { create: profile },
					payment_methods: { create: payment_methods },
				},
			});
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};

	static getAll = async (user_id: string) => {
		try {
			const userBusiness = await prisma.business.findMany({
				where: { user_id },
				include: { location: true, profile: true },
			});
			return userBusiness;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};

	get = async () => {
		try {
			const business = await prisma.business.findUnique({
				where: { id_user_id: this.id_user_id },
				include: {
					location: true,
					payment_methods: true,
					profile: true,
				},
			});
			if (!business)
				return Promise.reject(new DocumentNotFoundError("business does not exist"));
			return business;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};

	update = async ({ location, profile, settings, user_id, payment_methods }: UpdateBusiness) => {
		try {
			const res = await prisma.business.update({
				data: {
					user_id,
					location: { update: location },
					settings: { update: settings },
					profile: { update: profile },
					payment_methods: { update: payment_methods },
				},
				where: {
					id_user_id: this.id_user_id,
				},
			});
			if (!res) return Promise.reject(new DocumentNotFoundError("business does not exist"));
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
}
