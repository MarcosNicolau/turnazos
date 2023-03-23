import { Profile } from "@prisma/client";
import { CoordinateLocation } from "type/location";

export type CreateBusinessArgs = {
	user_id: string;
	profile: Omit<Profile, "id" | "rate">;
	location: CoordinateLocation;
};

export type CreateBranchArgs = Omit<CreateBusinessArgs, "user_id">;

export type UpdateBusinessArgs = {
	location?: CoordinateLocation;
	profile?: Partial<Omit<Profile, "id" | "rate">>;
};
