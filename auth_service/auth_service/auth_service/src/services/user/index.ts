import { REDIS_KEYS } from "constants/redis";
import { prisma } from "config/prisma";
import {
	ChangePasswordPayload,
	CreateUserPayload,
	ForgotPasswordPayload,
	GetWithCredentialsPayload,
	UpdateUserPayload,
} from "types/user";
import { compareSaltedString, saltString } from "utils/crypto";
import { InvalidCredentialsError, ValidationError, UnknownError } from "utils/error";
import { getPhoneNumberInfo } from "utils/phone";
import {
	getPhoneUsedError,
	getUserByPhone,
	getUserNotFoundError,
	passwordValidationSchema,
	userSanitization,
	validatePhoneInUse,
} from "./helpers";
import { EventEmitterService } from "../eventEmitter";
import { RedisClientService } from "../redis";

/**
 * @constructor @param id is necessary to perform GET, UPDATE, DELETE actions
 */
export class UserService {
	id: number;

	constructor(opts: { id: number }) {
		this.id = opts.id;
	}

	static async create({ phone, password, ...payload }: CreateUserPayload) {
		//Data validation
		const { error } = passwordValidationSchema.required().validate(password);
		if (error?.message) return Promise.reject(new ValidationError(error.message));
		const phoneNumber = getPhoneNumberInfo(phone);
		if (!phoneNumber.isValid() || !phoneNumber.country)
			return Promise.reject(new ValidationError("invalid phone number"));
		try {
			//Validate that the username isn't used.
			if (await validatePhoneInUse(phone)) return Promise.reject(getPhoneUsedError());

			//Don't save the password in plain text!
			const saltedPassword = await saltString(password);

			const user = await prisma.user.create({
				data: {
					...payload,
					password: saltedPassword,
					phone: {
						create: {
							country: phoneNumber.country,
							...phone,
						},
					},
				},
				select: userSanitization,
			});
			EventEmitterService.user.redisSet(user);
			return user;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	}

	async get() {
		try {
			const cachedUser = await RedisClientService.hashes.getAllFields(
				REDIS_KEYS.user(this.id)
			);
			if (cachedUser) cachedUser;
			const user = await prisma.user.findUnique({
				where: {
					id: this.id,
				},
				select: userSanitization,
			});
			if (!user) return Promise.reject(getUserNotFoundError());
			//Cache user
			EventEmitterService.user.redisSet(user);
			return user;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	}

	static async getAll() {
		try {
			const users = await prisma.user.findMany({
				select: userSanitization,
			});
			return users;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	}

	static async getWithCredentials({ phone, password }: GetWithCredentialsPayload) {
		try {
			const result = await getUserByPhone(phone);
			if (!result || !result.user) return Promise.reject(new InvalidCredentialsError());
			const { user } = result;
			//We compared the salted string
			try {
				await compareSaltedString(password, user.password);
			} catch {
				return Promise.reject(new InvalidCredentialsError());
			}
			//Filter the password to not expose it
			const { password: filterPassword, ...userSanitized } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
			return userSanitized;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	}

	async update({ phone, ...payload }: UpdateUserPayload) {
		try {
			//If username is passed, validate that username is not in use
			if (phone && (await validatePhoneInUse(phone)))
				return Promise.reject(getPhoneUsedError());

			const phoneNumber = phone && getPhoneNumberInfo(phone);
			if (phone && (!phoneNumber?.isValid() || !phoneNumber?.country))
				return Promise.reject(new ValidationError("invalid phone number"));

			const user = await prisma.user.update({
				where: {
					id: this.id,
				},
				data: {
					...payload,
					phone: {
						update: {
							...phone,
							country: phone && phoneNumber?.country,
						},
					},
				},
				select: userSanitization,
			});
			if (!user) return Promise.reject(getUserNotFoundError());
			EventEmitterService.user.redisSet(user);
			return user;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	}

	/**
	 * Changes the password by validating the old one
	 */
	async changePassword({ old_password, new_password }: ChangePasswordPayload) {
		try {
			const user = await prisma.user.findUnique({
				where: {
					id: this.id,
				},
			});
			if (!user) return Promise.reject(getUserNotFoundError());
			//Compare the old password
			try {
				await compareSaltedString(old_password, user?.password);
			} catch {
				return Promise.reject(new InvalidCredentialsError());
			}
			//Salt the new password and save it
			const saltedPassword = await saltString(new_password);
			return await prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					password: saltedPassword,
				},
				select: userSanitization,
			});
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	}

	/**
	 * @IMPORTANT This is different from the change password.
	 * This changes the password without validating anything
	 * So make sure you perform a 2FA validation.
	 */
	async forgotPassword({ password }: ForgotPasswordPayload) {
		try {
			const { error } = passwordValidationSchema.required().validate(password);
			if (error?.message) return Promise.reject(new ValidationError(error.message));
			const saltedPassword = await saltString(password);
			const user = await prisma.user.update({
				where: { id: this.id },
				data: { password: saltedPassword },
				select: userSanitization,
			});
			if (!user) return Promise.reject(getUserNotFoundError());
			return user;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	}

	async delete() {
		try {
			const user = await prisma.user.delete({
				where: {
					id: this.id,
				},
				select: userSanitization,
			});
			if (!user) return Promise.reject(getUserNotFoundError());
			EventEmitterService.user.redisDel({ id: this.id });
			return user;
		} catch (err) {
			Promise.reject(new UnknownError(err));
		}
	}
}
