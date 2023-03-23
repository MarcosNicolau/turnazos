import { APIResponse } from "type/http";

export type FileStorageUploadArgs = {
	base64: string;
	mimetype: string;
	public: boolean;
};

export type FileStorageAPIResponse = APIResponse<string[]>;
