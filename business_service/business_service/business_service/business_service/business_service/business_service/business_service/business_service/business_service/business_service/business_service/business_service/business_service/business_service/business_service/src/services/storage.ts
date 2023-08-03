import axios from "axios";
import { ENV_VARS } from "config/env";
import { FileStorageAPIResponse, FileStorageUploadArgs } from "type/services/fileStorage";

export class FileStorageService {
	static upload = async (files: FileStorageUploadArgs[]) => {
		try {
			if (!files.length) return [];
			const res = await axios.post<FileStorageAPIResponse>(
				`${ENV_VARS.STORAGE_SERVICE_URL}/storage`,
				{
					files,
				}
			);
			return res.data.result;
		} catch (err) {
			return Promise.reject(err);
		}
	};
}
