import { logger } from "config/logger";
import { createSuccessResponse } from "./../../utils/http";
import { IController } from "type/express";
import { createErrorResponse } from "utils/http";
import Joi from "joi";
import { FileReader } from "services/fileReader";
import { getDateInLogFormat } from "utils/date";

interface GetLogFileQueryParams {
	date?: string;
	level?: "exceptions";
}

export const getLogFile: IController = async (req, res) => {
	const query: GetLogFileQueryParams = req.query;
	const { date, level }: GetLogFileQueryParams = Object.fromEntries(
		Object.entries(query).map((item) => ({ ...item, 1: item[1].toString() }))
	);
	const { error: error1 } = Joi.string().valid("exceptions").validate(level);
	if (error1)
		return res
			.status(400)
			.send(
				createErrorResponse(
					res.statusCode,
					'level param must match on of the following values: "error, combined, exceptions"'
				)
			);
	//TODO: ADD DATE VALIDATION
	const fileReader = new FileReader();
	try {
		const log = await fileReader.readFile({
			path: `logs/${
				level === "exceptions" ? "exceptions" : date || getDateInLogFormat()
			}.log`,
		});
		return res.send(createSuccessResponse(log));
	} catch (err) {
		logger.error(err);
		return res.status(400).send(createErrorResponse(res.statusCode, "The file does not exist"));
	}
};
