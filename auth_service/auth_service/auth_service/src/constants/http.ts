export const HTTP_DEFAULT_MESSAGES: { [key: number]: string } = {
	400: "BadRequest",
	401: "Unauthorized",
	403: "Forbidden",
	404: "NotFound",
	408: "RequestTimeout",
	413: "PayloadTooLarge",
	415: "UnsupportedMediaType",
	422: "UnprocessableEntity",
	500: "InternalServerError",
	501: "NotImplemented",
	502: "BadGateway",
	503: "ServiceUnavailable",
};
