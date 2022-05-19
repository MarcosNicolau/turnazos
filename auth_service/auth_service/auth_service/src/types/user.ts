import { Phone, User } from "@prisma/client";

export type PhoneIdentifiers = Pick<Phone, "country_code" | "number">;

export type UserAndPhone = User & {
	phone: Phone;
};

export type SanitizedUser = Pick<User, "avatar_url" | "id" | "name" | "country"> & {
	phone: Phone;
};

export interface CreateUserPayload extends Omit<User, "id" | "created_at" | "phone_id"> {
	phone: PhoneIdentifiers;
}

export interface UpdateUserPayload
	extends Partial<Omit<User, "id" | "created_at" | "phone_id" | "password">> {
	phone?: PhoneIdentifiers;
}

export interface GetWithCredentialsPayload {
	phone: {
		number: number;
		country_code: number;
	};
	password: string;
}

export interface ChangePasswordPayload {
	old_password: string;
	new_password: string;
}

export interface ForgotPasswordPayload {
	password: string;
}

export interface UserRedisSetEventArgs extends Partial<Omit<UserAndPhone, "id">> {
	id: number;
}

export interface UserRedisDeleteEventArgs {
	id: number;
}

export interface UserRedisUpdateExpirationEventArgs {
	id: number;
}
