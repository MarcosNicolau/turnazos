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
			return filename;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};
}
