import { OTPCodeService } from "../services/OTPCode";
import { EventEmitter } from "events";
import { EVENTS } from "constants/events";
import { SanitizedUser } from "type/user";
import { LoggerService } from "services/logger";
import { Channel } from "amqplib";
import { AMQP } from "constants/amqp";
import { EventEmitterService } from "services/eventEmitter";
import { formatPhone } from "utils/phone";

export const userEvents = (eventEmitter: EventEmitter, amqpChannel: Channel) => {
	/*
	We create another otp code for logging in, because we want to save the user data with the otp code 
	So when confirming the log in we don't need to get the user info again. for more info about the login process check the docs.
	*/
	//TODO add auth flow link
	const generateLoginOTPCode = (user: SanitizedUser) => {
		setImmediate(async () => {
			try {
				const code = await OTPCodeService.generate(formatPhone(user.phone), user);
				EventEmitterService.notification.send({
					type: "otp_code",
					via: {
						whatsapp: {
							to: formatPhone(user.phone),
							messaging_product: "whatsapp",
							type: "text",
							text: { body: `Your code is ${code}` },
						},
					},
				});
			} catch (err: any) {
				LoggerService.sendLog(
					`There has been a problem while generating an OTP Code, err: ${JSON.stringify(
						err
					)}`,
					{ stack: err?.stack || new Error().stack, level: "warn" }
				);
			}
		});
	};

	const publishUserCreation = (user: SanitizedUser) => {
		setImmediate(() => {
			const res = amqpChannel.publish(
				AMQP.EXCHANGE.USER,
				AMQP.ROUTING_KEY.NEW_USER_CREATED,
				Buffer.from(JSON.stringify(user)),
				{ appId: AMQP.APP_ID }
			);
			if (res) LoggerService.sendLog("User creation event has been publish");
			else
				LoggerService.sendLog(`Could not publish user creation event, user_id: ${user.id}`);
		});
	};

	eventEmitter.on(EVENTS.USER.GENERATE_LOGIN_OTP_CODE, generateLoginOTPCode);
	eventEmitter.on(EVENTS.USER.PUBLISH_USER_CREATION, publishUserCreation);
};
