import { generateRandomKey } from "./../utils/crypto";
import { StorageUploadArgs } from "type/services/storage";
import fs from "fs";
import { ENV_VARS } from "config/env";
import { UnknownError } from "utils/error";

export class StorageService {
	static upload = async (file: StorageUploadArgs) => {
		try {
			const filename = `${generateRandomKey(20)}.${file.mimetype}`;
			const basedir = file.public
				? ENV_VARS.FILES_BASE_DIR_PUBLIC
				: ENV_VARS.FILES_BASE_DIR_PRIVATE;
			const path = `${basedir}/${filename}`;
			await fs.promises.writeFile(path, file.base64, "base64");
			return `${file.public ? "" : "private/"}${filename}`;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

	static bulkUpload = async (files: StorageUploadArgs[]) => {
		const filesPath: string[] = [];
		try {
			for await (const file of files) {
				const path = await this.upload(file);
				filesPath.push(path);
			}
			return filesPath;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};
}
