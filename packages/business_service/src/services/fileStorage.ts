import axios from "axios";
import { ENV_VARS } from "config/env";
import { FileStorageUploadPayload, FileStorageUploadResponse } from "type/services/fileStorage";

export class FileStorageService {
	static upload = async (files: FileStorageUploadPayload[]) => {
		try {
			const res = await axios.post<FileStorageUploadResponse>(
				`${ENV_VARS.FILE_STORAGE_API_URL}/storage/`,
				{
					files,
				}
			);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		}
	};
}
