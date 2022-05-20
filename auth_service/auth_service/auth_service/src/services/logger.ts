import { eventEmitter } from "config/eventEmitter";
import { EVENT_EMITTER_NAMES } from "constants/events";
import { AMQPSendLogEventArgs } from "type/events/amqp";

export class LoggerService {
	static sendLog(message: string, opts?: Partial<Omit<AMQPSendLogEventArgs, "message">>) {
		eventEmitter.emit(EVENT_EMITTER_NAMES.AMQP.SEND_LOG, <AMQPSendLogEventArgs>{
			message,
			level: opts?.level || "info",
			stack: opts?.stack || undefined,
		});
	}
}
