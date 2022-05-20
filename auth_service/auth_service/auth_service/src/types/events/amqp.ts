export type AMQPSendLogEventArgs = {
	level?: "error" | "info" | "silly" | "http" | "warn";
	message: string;
	stack?: string;
	httpCode?: number;
	description?: string;
};
