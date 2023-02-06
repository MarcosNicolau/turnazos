import { eventEmitter } from "config/eventEmitter";
import { EVENTS } from "constants/events";
import { SendNotificationArgs } from "type/events/notification";
import { SanitizedUser } from "type/user";

export class EventEmitterService {
	static user = {
		generateLoginOTPCode: (user: SanitizedUser) =>
			eventEmitter.emit(EVENTS.USER.GENERATE_LOGIN_OTP_CODE, user),
		publishUserCreation: (user: SanitizedUser) =>
			eventEmitter.emit(EVENTS.USER.PUBLISH_USER_CREATION, user),
	};
	static otpCode = {
		codeCreated: (key: string) => eventEmitter.emit(EVENTS.OTP_CODE.CREATED_CODE, key),
		blacklistKey: (key: string) => eventEmitter.emit(EVENTS.OTP_CODE.BLACKLIST_ID, key),
	};

	static notification = {
		send: (msg: SendNotificationArgs) => eventEmitter.emit(EVENTS.NOTIFICATION.SEND, msg),
	};
}
