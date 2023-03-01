import { StorageService } from "services/storage";
import { createErrorResponse, createSuccessResponse } from "utils/http";
import { StorageUploadArgs } from "type/services/storage";
import { IController } from "types/express";
import { AppError } from "utils/error";
import { isBase64 } from "utils/crypto";

type UploadBody = { files: StorageUploadArgs[] };

export const upload: IController = async (req, res) => {
	const body: UploadBody = req.body;
	if (!body.files)
		return res.status(400).send(createErrorResponse(res.statusCode, "did not send any file"));
	//Validate files
	const valid = body.files?.every((file) => {
		if (!file?.base64) {
			res.status(400).send(createErrorResponse(res.statusCode, "base64 is required"));
			return false;
		}
		if (!isBase64(file.base64)) {
			res.status(400).send(createErrorResponse(res.statusCode, "invalid base64"));
			return false;
		}
		if (!file?.mimetype) {
			res.status(400).send(createErrorResponse(res.statusCode, "mimetype is required"));
			return false;
		}
		return true;
	});
	if (!valid) return;
	try {
		// Upload files
		const filenames = await StorageService.bulkUpload(body.files);
		// Create files url
		const filesUrl = filenames.map((name) => `${req.headers.host}/v1/storage/${name}`);
		return res.send(createSuccessResponse(filesUrl));
	} catch (err) {
		return Promise.reject(err);
	}
};

export const get: (dirname?: string) => IController = (dirname) => (req, res, next) => {
	const id = req.params.id;

	const file = `${dirname}/${id}`;

	res.sendFile(file, (err) => {
		if (err) next(new AppError(err));
	});
};
