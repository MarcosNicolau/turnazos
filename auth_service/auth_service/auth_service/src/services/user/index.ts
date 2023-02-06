import { prisma } from "config/prisma";
import {
	ChangePasswordPayload,
	CreateUserPayload,
	ForgotPasswordPayload,
	GetWithCredentialsPayload,
} from "types/user";
import { compareSaltedString, saltString } from "utils/crypto";
import {
	InvalidCredentialsError,
	ValidationError,
	UnknownError,
	DocumentNotFoundError,
} from "utils/error";
import { getPhoneNumberInfo } from "utils/phone";
import {
	getPhoneUsedError,
	getUserByPhone,
	getUserNotFoundError,
	passwordValidationSchema,
	userSanitization,
	validatePhoneInUse,
} from "./helpers";

/**
 * @constructor @param id is necessary to perform GET, UPDATE, DELETE actions
 */
export class UserService {
	id: number;

	constructor(opts: { id: number }) {
		this.id = opts.id;
	}

	static get = async (id: number) => {
		try {
			const user = await prisma.user.findUnique({
				where: { id },
				select: userSanitization,
			});
			if (!user) return Promise.reject(new DocumentNotFoundError("user does not exist"));
			return user;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	};

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
			return user;
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
			const valid = await compareSaltedString(password, user.password);
			if (!valid) return Promise.reject(new InvalidCredentialsError());
			//Filter the password to not expose it
			const { password: filterPassword, ...userSanitized } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
			return userSanitized;
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
	 * This changes the password without validating the old one.
	 * So make sure you perform a 2FA validation.
	 */
	static async forgotPassword({ password, phone }: ForgotPasswordPayload) {
		try {
			const { error } = passwordValidationSchema.required().validate(password);
			if (error?.message) return Promise.reject(new ValidationError(error.message));
			const saltedPassword = await saltString(password);
			//Find user with the given number
			const user = await prisma.phone.findFirst({
				where: { number: phone.number, country_code: phone.country_code },
				select: { user: { select: { id: true } } },
			});
			if (!user) return Promise.reject(getUserNotFoundError());
			await prisma.user.update({
				where: { id: user.user?.id },
				data: { password: saltedPassword },
			});
			return;
		} catch (err) {
			return Promise.reject(new UnknownError(err));
		}
	}
}
