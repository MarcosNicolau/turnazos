import { prisma } from "config/prisma";
import { BusinessVerificationStatus, BUSINESS_VERIFICATION_STATUS } from "constants/business";
import { FileStorageService, EventEmitterService } from "services";
import { FileStorageUploadPayload } from "type/services/fileStorage";
import { DocumentNotFoundError, UnknownError } from "utils/error";

export class BusinessVerification {
	id: number;
	constructor({ id }: { id: number }) {
		this.id = id;
	}

	upload = async (documents_base_64: FileStorageUploadPayload[]) => {
		try {
			const res = await FileStorageService.upload(documents_base_64);
			if (!res.result?.length) Promise.reject(new UnknownError());
			const business = await prisma.business.update({
				data: {
					settings: {
						update: {
							verification: {
								update: {
									documents: {
										createMany: {
											data: res.result.map((doc) => ({
												url: doc,
											})),
										},
									},
									verification_status: BUSINESS_VERIFICATION_STATUS.IN_REVISION,
								},
							},
						},
					},
				},
				include: {
					profile: true,
				},
				where: { id: this.id },
			});
			if (!business) return Promise.reject(new DocumentNotFoundError());
			EventEmitterService.business.requestVerification({
				business_id: this.id,
				business_name: business.profile.name,
				files: res.result,
			});
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};

	/**
	 * @returns the amount of deleted documents, you could check if the deleted documents match the count.
	 *
	 * @example
	 * const deletedCount = removeDocumentation(documents_id);
	 *
	 * if(deletedCount !== documents_id.length) return "could not delete all documents"
	 */
	removeDocumentation = async (documents_id: number[]) => {
		try {
			const { count } = await prisma.document.deleteMany({
				where: { id: { in: documents_id } },
			});
			return count;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};

	setStatus = async (status: BusinessVerificationStatus) => {
		try {
			const business = await prisma.business.update({
				data: {
					settings: {
						update: {
							verification: {
								update: {
									verification_status: status,
								},
							},
						},
					},
				},
				include: { profile: true },
				where: { id: this.id },
			});
			if (!business) return Promise.reject(new DocumentNotFoundError());
			EventEmitterService.business.verificationStatusUpdate({
				user_id: business.user_id,
				status,
				business_name: business.profile.name,
			});
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
}
