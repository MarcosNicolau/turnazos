import { eventEmitter } from "config/eventEmitter";
import { EVENT_EMITTER_NAMES } from "constants/events";
import { SendLogEventArgs } from "type/events/logger";

export class LoggerService {
	static sendLog(message: string, opts?: Partial<Omit<SendLogEventArgs, "message">>) {
		eventEmitter.emit(EVENT_EMITTER_NAMES.AMQP.SEND_LOG, <SendLogEventArgs>{
			message,
			level: opts?.level || "info",
			...opts,
		});
	}
}
