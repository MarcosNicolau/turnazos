export type SendLogEventArgs = {
	level: "error" | "info" | "silly" | "http" | "warn";
	message: string;
	stack?: string;
	httpCode?: number;
	description?: string;
};
