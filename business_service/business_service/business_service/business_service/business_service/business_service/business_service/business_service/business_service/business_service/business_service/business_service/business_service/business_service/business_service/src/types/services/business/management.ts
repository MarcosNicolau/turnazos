import { Profile } from "@prisma/client";
import { CoordinateLocation } from "type/location";
import { FileStorageUploadArgs } from "type/services/fileStorage";

export type CreateBusinessArgs = {
	user_id: string;
	profile: Omit<Profile, "id" | "rate" | "logo_url" | "cover_url"> & {
		logo?: Omit<FileStorageUploadArgs, "public">;
		cover?: Omit<FileStorageUploadArgs, "public">;
	};
	location: CoordinateLocation;
};

export type UpdateBusinessArgs = {
	location?: CoordinateLocation;
	profile?: Partial<CreateBusinessArgs["profile"]>;
};
