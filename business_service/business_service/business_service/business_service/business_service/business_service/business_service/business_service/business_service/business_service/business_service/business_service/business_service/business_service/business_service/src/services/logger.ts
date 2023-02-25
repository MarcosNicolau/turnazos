import { SendLogEventArgs } from "type/events/logger";
import { eventEmitter } from "config/eventEmitter";
import { EVENTS } from "constants/events";

export class LoggerService {
	static sendLog(message: string, opts?: Partial<Omit<SendLogEventArgs, "message">>) {
		eventEmitter.emit(EVENTS.LOGGER.SEND_LOG, <SendLogEventArgs>{
			message,
			level: opts?.level || "info",
			...opts,
		});
	}
}
