import { prisma } from "config/prisma";
import { createLocation } from "./helpers";
import { CreateBusinessArgs, UpdateBusinessArgs } from "type/services/business/management";
import { DocumentNotFoundError, UnknownError } from "utils/errors";
import { Location } from "@prisma/client";
import { FileStorageService } from "services/storage";
import { insertIf } from "utils/arrays";

interface Constructor {
	business_id: string;
}
export class BusinessManagementService implements Constructor {
	business_id;

	constructor({ business_id }: Constructor) {
		this.business_id = business_id;
	}

	static create = async ({
		location: coordinates,
		profile: { logo, cover, ...profile },
		user_id,
	}: CreateBusinessArgs) => {
		try {
			const location = await createLocation(coordinates);
			const [logo_url = "", cover_url = ""] = await FileStorageService.upload([
				...insertIf(!!logo, [
					{ base64: logo?.base64, mimetype: logo?.mimetype, public: true },
				]),
				...insertIf(!!cover, [
					{ base64: cover?.base64, mimetype: cover?.mimetype, public: true },
				]),
			]);
			await prisma.business.create({
				data: {
					user_id,
					branch: {
						create: {},
					},
					location: { create: location },
					profile: {
						create: {
							...profile,
							logo_url,
							cover_url,
							rate: 0,
						},
					},
					settings: {
						create: {},
					},
				},
			});
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	createBranch = async ({
		location: coordinates,
		profile: { logo, cover, ...profile },
		user_id,
	}: CreateBusinessArgs) => {
		try {
			//Get the business branch to connect the relation on the new business branch
			const business = await prisma.business.findUnique({
				where: { id: this.business_id },
				select: { branch: true },
			});
			if (!business) return Promise.reject(new DocumentNotFoundError());
			const [logo_url = "", cover_url = ""] = await FileStorageService.upload([
				...insertIf(!!logo, [
					{ base64: logo?.base64, mimetype: logo?.mimetype, public: true },
				]),
				...insertIf(!!cover, [
					{ base64: cover?.base64, mimetype: cover?.mimetype, public: true },
				]),
			]);
			const location = await createLocation(coordinates);
			await prisma.business.create({
				data: {
					user_id,
					branch: { connect: { id: business.branch.id } },
					location: { create: location },
					profile: {
						create: {
							...profile,
							logo_url,
							cover_url,
							rate: 0,
						},
					},
					settings: { create: {} },
				},
			});
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
				where: { id: this.business_id },
			});
			if (!res) return Promise.reject(new DocumentNotFoundError());
			return res;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};

	update = async ({ location: coordinates, profile = {} }: UpdateBusinessArgs) => {
		try {
			let location: Omit<Location, "id"> | undefined;
			if (coordinates) location = await createLocation(coordinates);
			const { logo, cover, ...profileData } = profile;
			const [logo_url, cover_url] = await FileStorageService.upload([
				...insertIf(!!logo, [
					{
						base64: logo?.base64,
						mimetype: logo?.mimetype,
						public: true,
					},
				]),
				...insertIf(!!profile?.cover, [
					{
						base64: cover?.base64,
						mimetype: cover?.mimetype,
						public: true,
					},
				]),
			]);
			await prisma.business.update({
				data: {
					location: { update: location },
					profile: { update: { ...profileData, logo_url, cover_url } },
				},
				where: { id: this.business_id },
			});
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	delete = async () => {
		try {
			await prisma.business.delete({ where: { id: this.business_id } });
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};
}
