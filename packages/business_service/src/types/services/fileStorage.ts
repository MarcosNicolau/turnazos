import { APIResponse } from "type/api";

export type FileStorageUploadPayload = {
	base64: string;
	mimetype: string;
	public: boolean;
};

export type FileStorageUploadResponse = APIResponse<string[]>;
