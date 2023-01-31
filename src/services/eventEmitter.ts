import { EVENTS } from "./../constants/events";
import { eventEmitter } from "config/eventEmitter";
import { SendNotification } from "type/services/notification";

export class EventEmitterService {
	static sendNotification = (message: SendNotification) => {
		eventEmitter.emit(EVENTS.NOTIFICATION.SEND, message);
	};
}
