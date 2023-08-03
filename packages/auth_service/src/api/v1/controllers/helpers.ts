import Joi from "joi";
import { passwordValidationSchema } from "services/user/helpers";
import {
	CreateUserPayload,
	UpdateUserPayload,
	GetWithCredentialsPayload,
	ChangePasswordPayload,
	ForgotPasswordPayload,
} from "types/user";

export const userJoiSchemas = {
	create: Joi.object<CreateUserPayload>({
		phone: Joi.object<CreateUserPayload["phone"]>({
			country_code: Joi.number().required(),
			number: Joi.number().required(),
		}),
		password: passwordValidationSchema.required(),
		name: Joi.string().required(),
	}),
	update: Joi.object<UpdateUserPayload>({
		phone: Joi.object<UpdateUserPayload["phone"]>({
			country_code: Joi.number().required(),
			number: Joi.number().required(),
		}).optional(),
		name: Joi.string().optional(),
	}),
	credentials: Joi.object<GetWithCredentialsPayload>({
		password: Joi.string().required(),
		phone: Joi.object<GetWithCredentialsPayload["phone"]>({
			country_code: Joi.string().required(),
			number: Joi.string().required(),
		}).required(),
	}),
	changePassword: Joi.object<ChangePasswordPayload>({
		old_password: Joi.string().required(),
		new_password: Joi.string().required(),
	}),
	forgotPassword: Joi.object<ForgotPasswordPayload>({
		password: Joi.string().required(),
	}),
};
