import { createSuccessResponse } from "utils/http";
import { UserService } from "services/user";
import { IController } from "types/express";
import { userJoiSchemas } from "./helpers";
import { ValidationError } from "utils/error";

export const createUser: IController = async (req, res, next) => {
	try {
		const { value, error } = userJoiSchemas.create.validate(req.body);
		if (error?.message || !value) return next(new ValidationError(error.message));
		const { phone, ...payload } = value;
		await UserService.create({
			...payload,
			phone: {
				...phone,
				number: Number(phone.number),
				country_code: Number(phone.country_code),
			},
		});
		return res.send(createSuccessResponse());
	} catch (err) {
		return next(err);
	}
};

export const getUser: IController = async (req, res, next) => {
	const { id } = req.user;
	try {
		const user = await new UserService({ id }).get();
		return res.send(createSuccessResponse(user));
	} catch (err) {
		return next(err);
	}
};

export const getAllUsers: IController = async (req, res, next) => {
	try {
		const users = await UserService.getAll();
		return res.send(createSuccessResponse(users));
	} catch (err) {
		return next(err);
	}
};

export const getUserWithCredentials: IController = async (req, res, next) => {
	try {
		const { value, error } = userJoiSchemas.credentials.validate(req.body);
		if (error?.message || !value) return next(new ValidationError(error.message));
		const user = await UserService.getWithCredentials(value);
		return res.send(createSuccessResponse(user));
	} catch (err) {
		return next(err);
	}
};

export const updateUser: IController = async (req, res, next) => {
	const { id } = req.user;
	try {
		const { value, error } = userJoiSchemas.update.validate(req.body);
		if (error?.message || !value) return next(new ValidationError(error.message));
		await new UserService({ id }).update(value);
		return res.send(createSuccessResponse());
	} catch (err) {
		return next(err);
	}
};

export const changePassword: IController = async (req, res, next) => {
	const { id } = req.user;
	try {
		const { value, error } = userJoiSchemas.changePassword.validate(req.body);
		if (error?.message || !value) return next(new ValidationError(error.message));
		await new UserService({ id }).changePassword(value);
		return res.send(createSuccessResponse());
	} catch (err) {
		return next(err);
	}
};

export const forgotPassword: IController = async (req, res, next) => {
	const { id } = req.user;
	try {
		const { value, error } = userJoiSchemas.forgotPassword.validate(req.body);
		if (error?.message || !value) return next(new ValidationError(error.message));
		await new UserService({ id }).forgotPassword(value);
		return res.send(createSuccessResponse());
	} catch (err) {
		return next(err);
	}
};

export const deleteUser: IController = async (req, res, next) => {
	const { id } = req.user;
	try {
		await new UserService({ id }).delete();
		return res.send(createSuccessResponse());
	} catch (err) {
		return next(err);
	}
};
