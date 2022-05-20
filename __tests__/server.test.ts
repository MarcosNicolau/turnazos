import express from "express";
import { getHelloWord } from "controllers";
import { startServer } from "server";
import { mockRequest, mockResponse } from "../__tests__/mocks";

it("should start server", () => {
	const app = express();
	startServer(app);
	expect(app.listen).toHaveBeenCalled();
	expect(app.get).toHaveBeenCalledWith("/", getHelloWord);
});

it("should send hello world", () => {
	const res = mockResponse();
	getHelloWord(mockRequest(), res);
	expect(res.send).toHaveBeenCalledWith("Hello world!");
});
