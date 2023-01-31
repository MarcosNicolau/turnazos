import { SendNotification } from "./../types/services/notification";
import { ENV_VARS } from "config/env";
import { WABAClient } from "whatsapp-business";
import { LoggerService } from "services/logger";

export class NotificationService {
	whatsappClient = new WABAClient({
		accountId: ENV_VARS.WABA_ACCOUNT_ID || "",
		apiToken: ENV_VARS.WABA_API_TOKEN || "",
		phoneId: ENV_VARS.WABA_PHONE_ID || "",
	});
	sendWhatsAppNotification = async (
		message: SendNotification["via"]["whatsapp"],
		type: SendNotification["type"]
	) => {
		try {
			if (!message) return;
			//TODO based on the type we would send the message using a different template
			await this.whatsappClient.sendMessage(message);
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
	/**
	 * Sends a notification to the services provided by the @via object passed in the @msg parameter
	 */
	sendNotification = async (msg: SendNotification) => {
		const { via, type } = msg;
		const whatsappMessage = via.whatsapp;
		if (whatsappMessage) await this.sendWhatsAppNotification(whatsappMessage, type);
	};
}
