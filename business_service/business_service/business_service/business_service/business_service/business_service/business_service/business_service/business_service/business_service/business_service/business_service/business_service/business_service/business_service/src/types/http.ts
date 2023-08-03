import { StatusCodes } from "http-status-codes";

export type APIResponse<T> = {
	result: T;
	message: string;
	statusCode: StatusCodes;
	error: boolean;
};
