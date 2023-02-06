import { prisma } from "./../../config/prisma";
import { ValidationError } from "../../utils/error";
import { Phone } from "@prisma/client";
import { DocumentNotFoundError } from "utils/error";
import Joi from "joi";
import { PhoneIdentifiers } from "types/user";
import { PASSWORD_REQUIREMENTS } from "constants/password";

/**
 *This is what we pass in the select object in prisma So we don't expose sensitive data
 */
export const userSanitization = {
	id: true,
	name: true,
	phone: true,
	phone_id: true,
};

export const getUserNotFoundError = () => new DocumentNotFoundError("user not found");

export const getPhoneUsedError = () => new ValidationError("phone already used");

export const passwordValidationSchema = Joi.string()
	.min(PASSWORD_REQUIREMENTS.MIN_CHARACTERS)
	.messages({ "string.min": "password must be 8 characters min" });

export const getUserByPhone = async ({
	country_code,
	number,
}: Pick<Phone, "country_code" | "number">) =>
	await prisma.phone.findFirst({
		where: {
			country_code,
			number,
		},
		select: {
			user: {
				include: {
					phone: true,
				},
			},
		},
	});

export const validatePhoneInUse = async ({
	country_code,
	number,
}: PhoneIdentifiers): Promise<boolean> =>
	!!(await prisma.phone.findFirst({
		where: {
			country_code,
			number,
		},
	}));
