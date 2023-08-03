import { Request, Response } from "express";

jest.mock("express", () => ({
	__esModule: true,
	default: jest.fn(() => ({
		get: jest.fn(),
		listen: jest.fn(),
		use: jest.fn(),
	})),
}));

const response = () => {
	const res: Partial<Response> = {};
	res.status = jest.fn().mockReturnValue(res);
	res.send = jest.fn().mockReturnValue(res);
	return res;
};
export const request = () => {
	const req: Partial<Request> = {};
	return req;
};

export const mockResponse = response as () => Response;
export const mockRequest = request as () => Request;
