import { BUSINESS_VERIFICATION_STATUS } from "./../constants/business";
import { EVENTS } from "constants/events";
import EventEmitter from "events";
import { EventEmitterService } from "services/eventEmitter";
import {
	BusinessRequestVerificationTemplateData,
	BusinessVerificationStatusUpdateArgs,
	BusinessClientGrantAccessArgs,
} from "type/events/business";
import { APP_TEMPLATES, MAIL_TEMPLATES } from "constants/notification";

export const businessEvents = (eventEmitter: EventEmitter) => {
	eventEmitter.on(
		EVENTS.BUSINESS.REQUEST_VERIFICATION,
		(args: BusinessRequestVerificationTemplateData) => {
			setImmediate(async () => {
				EventEmitterService.notification.send({
					via: {
						email: {
							to: "admin",
							template: {
								data: args,
								id: MAIL_TEMPLATES.BUSINESS.REQUEST_VERIFICATION,
							},
						},
					},
				});
			});
		}
	);

	eventEmitter.on(
		EVENTS.BUSINESS.VERIFICATION_STATUS_UPDATE,
		(args: BusinessVerificationStatusUpdateArgs) => {
			setImmediate(async () => {
				if (args.status === BUSINESS_VERIFICATION_STATUS.IN_REVISION) return;
				EventEmitterService.notification.send({
					via: {
						app: {
							user_id: args.user_id,
							header: APP_TEMPLATES.BUSINESS.VERIFICATION_STATUS_UPDATE.header(
								args.business_name
							),
							body: APP_TEMPLATES.BUSINESS.VERIFICATION_STATUS_UPDATE.text(
								args.status
							),
						},
					},
				});
			});
		}
	);

	eventEmitter.on(EVENTS.BUSINESS.CLIENT_GRANT_ACCESS, (args: BusinessClientGrantAccessArgs) => {
		setImmediate(async () => {
			EventEmitterService.notification.send({
				via: {
					app: {
						user_id: args.user_id,
						header: APP_TEMPLATES.BUSINESS.CLIENT_ACCESS_GRANTED.header,
						body: APP_TEMPLATES.BUSINESS.CLIENT_ACCESS_GRANTED.text({ ...args }),
					},
				},
			});
		});
	});
};
