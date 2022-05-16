import { ENV_VARS } from "config/env";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export const loggerLevels = winston.config.npm.levels;

const transport: DailyRotateFile = new DailyRotateFile({
	filename: "%DATE%.log",
	datePattern: "MM-DD-YYYY",
	maxSize: "20m",
	maxFiles: "14d",
	json: true,
	dirname: "$PWD/logs",
});

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
	transports: ENV_VARS.NODE_ENV === "dev" ? [] : transport,
	exceptionHandlers: [new winston.transports.File({ filename: "logs/exceptions.log" })],
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
