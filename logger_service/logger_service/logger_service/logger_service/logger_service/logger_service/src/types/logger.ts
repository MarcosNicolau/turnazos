export const loggerLevels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	verbose: 4,
	debug: 5,
	silly: 6,
} as const;

export type LoggerLevels = keyof typeof loggerLevels;

export type LoggerParams = {
	level: LoggerLevels;
	message: string;
	stack?: string;
	httpCode?: number;
	description?: string;
};
