import { ENV_VARS } from "config/env";
import winston from "winston";

export const loggerLevels = winston.config.npm.levels;

export const logger = winston.createLogger({
	levels: loggerLevels,
	format: winston.format.combine(
		winston.format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.colorize(),
		winston.format.json()
	),
	transports:
		ENV_VARS.NODE_ENV === "dev"
			? []
			: [
					new winston.transports.File({ filename: "error.log", level: "error" }),
					new winston.transports.File({ filename: "combined.log", level: "" }),
			  ],

	exceptionHandlers: [new winston.transports.File({ filename: "exceptions.log" })],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	);
}
