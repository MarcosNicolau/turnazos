import { Notification } from "types/services/notification";
import { ENV_VARS } from "config/env";
import { LoggerService } from "services/logger";
import { emailClient } from "config/sendgrid";
import { EMAIL_TEMPLATES } from "constants/notification";
import { whatsappClient } from "config/whatsapp";

type SendViaNotification<Via extends keyof Notification["via"]> = {
	message: Required<Notification["via"]>[Via];
};
export class NotificationService {
	static sendWhatsAppNotification = async ({ message }: SendViaNotification<"whatsapp">) => {
		try {
			if (!message || !message.content) return;
			//TODO based on the type we would send the message using a different template
			await whatsappClient.sendMessage({ ...message.content });
			LoggerService.sendLog(`Notification sent via whatsapp`, {
				level: "info",
			});
		} catch (err: any) {
			LoggerService.sendLog(
				`There was an error while sending a whatsapp notification, err: ${JSON.stringify(
					err
				)}`,
				{
					level: "error",
					stack: err?.stack,
				}
			);
		}
	};
	static sendEmailNotification = async ({ message }: SendViaNotification<"email">) => {
		const from = ENV_VARS.EMAIL_FROM || "";
		try {
			if (message.admin_fail_warning) {
				const { err } = message.admin_fail_warning;
				const { templateId, to } = EMAIL_TEMPLATES.admin_fail_warning;
				await emailClient.send({
					from,
					to,
					templateId,
					dynamicTemplateData: { err },
				});
			}
			if (message.business_request_verification) {
				const data = message.business_request_verification;
				const { templateId, to } = EMAIL_TEMPLATES.business_requested_verification;
				await emailClient.send({ from, to, templateId, dynamicTemplateData: data });
			}
			if (message.other) {
				await emailClient.send({ from, ...message.other });
			}
		} catch (err) {
			return Promise.reject(err);
		}
	};
	static sendAppNotification = async ({ message }: SendViaNotification<"app">) => {
		// TODO add app notification
		return true;
	};
	/**
	 * Sends a notification to the services provided by the @via object passed in the @msg parameter
	 */
	static sendNotification = async (msg: Notification) => {
		const { via } = msg;
		const { app, email, whatsapp } = via;
		if (whatsapp) await this.sendWhatsAppNotification({ message: whatsapp });
		if (email) await this.sendEmailNotification({ message: email });
		if (app) await this.sendAppNotification({ message: app });
	};
}
