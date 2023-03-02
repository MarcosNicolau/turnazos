import { EVENTS } from "./../constants/events";
import { eventEmitter } from "config/eventEmitter";
import { Notification } from "type/services/notification";

export class EventEmitterService {
	static sendNotification = (message: Notification) => {
		eventEmitter.emit(EVENTS.NOTIFICATION.SEND, message);
	};
}
