import {
	BusinessClientGrantAccessArgs,
	BusinessVerificationStatusUpdateArgs,
} from "./../types/events/business";
import { eventEmitter } from "config/eventEmitter";
import { EVENTS } from "constants/events";
import { BusinessRequestVerificationTemplateData } from "type/events/business";
import { SendNotificationArgs } from "type/events/notification";

export class EventEmitterService {
	static notification = {
		send: (msg: SendNotificationArgs) => {
			eventEmitter.emit(EVENTS.NOTIFICATION.SEND, msg);
		},
	};
	static business = {
		requestVerification: (args: BusinessRequestVerificationTemplateData) => {
			eventEmitter.emit(EVENTS.BUSINESS.REQUEST_VERIFICATION, args);
		},
		verificationStatusUpdate: (args: BusinessVerificationStatusUpdateArgs) => {
			eventEmitter.emit(EVENTS.BUSINESS.VERIFICATION_STATUS_UPDATE, args);
		},
		clientAccessGranted: (args: BusinessClientGrantAccessArgs) => {
			eventEmitter.emit(EVENTS.BUSINESS.CLIENT_GRANT_ACCESS, args);
		},
	};
}
