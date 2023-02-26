import { StorageService } from "services/storage";
import { createErrorResponse, createSuccessResponse } from "utils/http";
import { ENV_VARS } from "config/env";
import { StorageUploadArgs } from "type/services/storage";
import { IController } from "types/express";

type UploadBody = StorageUploadArgs;

export const upload: IController = async (req, res) => {
	const body: UploadBody = req.body;

	//Validation
	if (!body?.base64)
		return res.status(400).send(createErrorResponse(res.statusCode, "base64 is required"));
	if (!body?.mimetype)
		return res.status(400).send(createErrorResponse(res.statusCode, "mimetype is required"));

	//Upload file
	try {
		const filename = await StorageService.upload(body);
		const url = `${req.headers.host}/v1/storage/${filename}`;
		return res.send(createSuccessResponse(url));
	} catch (err) {
		return Promise.reject(err);
	}
};

export const getPublic: IController = async (req, res) => {
	const id = req.params.id;

	const file = `${ENV_VARS.FILES_BASE_DIR_PUBLIC}/${id}`;

	res.sendFile(file);
};

export const getPrivate: IController = async (req, res) => {
	const id = req.params.id;

	const file = `${ENV_VARS.FILES_BASE_DIR_PRIVATE}/${id}`;

	res.sendFile(file);
};
