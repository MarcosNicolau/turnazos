import { eventEmitter } from "config/eventEmitter";
import { EVENTS } from "constants/events";
import { SendNotificationArgs } from "type/events/notifications";

export class EventEmitterService {
	static notification = {
		send: (msg: SendNotificationArgs) => eventEmitter.emit(EVENTS.NOTIFICATION.SEND, msg),
	};
}
