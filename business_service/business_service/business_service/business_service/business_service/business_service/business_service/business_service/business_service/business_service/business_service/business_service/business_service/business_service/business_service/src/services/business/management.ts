import { prisma } from "config/prisma";
import { createLocation } from "./helpers";
import {
	CreateBranchArgs,
	CreateBusinessArgs,
	UpdateBusinessArgs,
} from "type/services/business/management";
import { DocumentNotFoundError, UnknownError } from "utils/errors";
import { Location } from "@prisma/client";

export class BusinessManagementService {
	id: string;
	user_id: string;
	//Used to validate that the request for the business belongs to the user_id provided in the JWT payload
	id_user_id: { id: string; user_id: string };

	constructor({ id, user_id }: { id: string; user_id: string }) {
		this.id = id;
		this.user_id = user_id;
		this.id_user_id = {
			id,
			user_id,
		};
	}

	static create = async ({ location: coordinates, profile, user_id }: CreateBusinessArgs) => {
		try {
			const location = await createLocation(coordinates);
			const res = await prisma.business.create({
				data: {
					user_id,
					branch: {
						create: {},
					},
					location: { create: location },
					profile: {
						create: {
							...profile,
							rate: 0,
						},
					},
					settings: {
						create: {},
					},
				},
			});
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};
	createBranch = async ({ location: coordinates, profile }: CreateBranchArgs) => {
		try {
			//Get the business branch to connect the relation on the new business branch
			const business = await prisma.business.findUnique({
				where: { id_user_id: this.id_user_id },
				select: { branch: true },
			});
			if (!business) return Promise.reject(new DocumentNotFoundError());
			const location = await createLocation(coordinates);
			const res = await prisma.business.create({
				data: {
					user_id: this.user_id,
					branch: { connect: { id: business.branch.id } },
					location: { create: location },
					profile: {
						create: {
							...profile,
							rate: 0,
						},
					},
					settings: { create: {} },
				},
			});
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};
	static getAll = async (user_id: string) => {
		try {
			const res = await prisma.business.findMany({
				select: {
					branch: { select: { business: { select: { id: true } } } },
					profile: true,
				},
				where: { user_id },
			});
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};
	get = async () => {
		try {
			const res = await prisma.business.findUnique({
				select: {
					branch: {
						select: { business: { select: { profile: true, location: true } } },
					},
					profile: true,
					location: true,
				},
				where: { id_user_id: this.id_user_id },
			});
			if (!res) return Promise.reject(new DocumentNotFoundError());
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
	update = async ({ location: coordinates, profile }: UpdateBusinessArgs) => {
		try {
			let location: Omit<Location, "id"> | undefined;
			if (coordinates) location = await createLocation(coordinates);
			const res = await prisma.business.update({
				data: { location: { update: location }, profile: { update: profile } },
				where: { id_user_id: this.id_user_id },
			});
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};
	delete = async () => {
		try {
			const res = await prisma.business.delete({ where: { id_user_id: this.id_user_id } });
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};
}
