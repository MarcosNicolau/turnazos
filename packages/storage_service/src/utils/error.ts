import { getReasonPhrase, StatusCodes } from "http-status-codes";

// centralized error object that derives from Node’s Error
// throw this when catching errors
export class AppError extends Error {
	public readonly message: string;
	public readonly httpCode?: StatusCodes;
	public readonly isOperational?: boolean;
	public readonly description?: string;

	constructor({
		description,
		httpCode,
		statusCode,
		isOperational,
		message,
	}: {
		message?: string;
		httpCode?: StatusCodes;
		statusCode?: number;
		description?: string;
		isOperational?: boolean;
	}) {
		super(description);
		Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

		this.httpCode = httpCode || statusCode;
		this.message = message || getReasonPhrase(this.httpCode || 500);
		this.isOperational = isOperational;
		this.description = description;

		Error.captureStackTrace(this);
	}
}

//Common business layer errors

/**
 * Throws this error for validation exceptions. For example, while using Joi
 */
export class ValidationError extends AppError {
	constructor(message: string) {
		super({ httpCode: StatusCodes.BAD_REQUEST, isOperational: false, message });
	}
}

/**
 * Throws this error when a document does not exist.
 *
 * @example
 * ...
 * const user = await prisma.user.findUnique({ where: { id } });
 * if(!user) return Promise.reject(new DocumentNotFoundError("user does not exist"))
 * ...
 */
export class DocumentNotFoundError extends AppError {
	constructor(message?: string) {
		super({
			httpCode: StatusCodes.NOT_FOUND,
			isOperational: false,
			message: message || "document not found",
		});
	}
}

export class InvalidCredentialsError extends AppError {
	constructor(message?: string) {
		super({
			httpCode: StatusCodes.UNAUTHORIZED,
			isOperational: false,
			message: message || "invalid credentials",
		});
	}
}

/**
 * Throws this error when you don't know what can cause the error.
 * Pass the err object because we used it for latter debugging
 *
 * @example
 * ...
 * try {
 *  const user = await prisma.user.findUnique({ where: { id } });
 * }
 * catch(err) {
 *	 return Promise.reject(new UnknownError(err))
 * }
 * ...
 */
export class UnknownError extends AppError {
	constructor(err?: any | unknown) {
		super({
			httpCode: 500,
			isOperational: true,
			description: `operational error, err: ${JSON.stringify(err)}`,
			message: getReasonPhrase(500),
		});
	}
}
