import { ENV_VARS } from "config/env";
import { loggerLevels, LoggerLevels } from "type/logger";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { MESSAGE } from "triple-beam";

/**
 * Creates a daily rotate file transport for the provided @level
 * For example, if you pass warn as the level, then the file will only contain the warn logs
 */
const createDailyRotateFileTransportByLevel = (
	level: LoggerLevels,
	opts: DailyRotateFile.DailyRotateFileTransportOptions
) => {
	const transport = new DailyRotateFile({
		//@ts-expect-error wrongly complains about the type
		filename: "%DATE%.log",
		datePattern: "MM-DD-YYYY",
		json: true,
		level,
		dirname: `${ENV_VARS.LOGS_DIR_NAME}/${level}`,
		maxSize: "20m",
		...opts,
	});
	transport.log = (info, next = () => "") => {
		//We only want to save those logs that match the level
		if (!info.level.includes(level)) return;
		transport.logStream.write(info[MESSAGE] + transport.options.eol);
		transport.emit("logged", info);
		//@ts-expect-error sometimes the next fn requires these params
		next(null, true);
	};

	return transport;
};

const transports: DailyRotateFile[] = [
	createDailyRotateFileTransportByLevel("error", {
		maxFiles: "14d",
	}),
	createDailyRotateFileTransportByLevel("warn", {
		maxFiles: "10d",
	}),
	createDailyRotateFileTransportByLevel("info", {
		maxFiles: "2d",
	}),
	new DailyRotateFile({
		filename: "%DATE%.log",
		datePattern: "MM-DD-YYYY",
		json: true,
		level: "silly",
		dirname: `${ENV_VARS.LOGS_DIR_NAME}/all`,
		maxSize: "20m",
		maxFiles: "1d",
	}),
];

export const logger = winston.createLogger({
	levels: loggerLevels,
	level: "silly",
	format: winston.format.combine(
		winston.format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		winston.format.errors({ stack: true }),
		winston.format.splat(),
		winston.format.colorize(),
		winston.format.json()
	),
	transports: ENV_VARS.NODE_ENV === "production" ? transports : [],
	exceptionHandlers: [
		new winston.transports.File({ filename: `${ENV_VARS.LOGS_DIR_NAME}/exceptions.log` }),
	],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (ENV_VARS.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	);
}
