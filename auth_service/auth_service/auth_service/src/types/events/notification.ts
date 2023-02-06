import { Message } from "whatsapp-business";

export type NotificationVia = "email" | "whatsapp" | "sms" | "app";

export type SendNotificationArgs = {
	via: {
		whatsapp?: Message;
		//We don't support email notifications yet, but this is a little how it should look like
		email?: {
			title: string;
			subject: string;
			body: string;
			to: string[];
		};
	};
	type: "otp_code" | "authentication" | "admin_fail_warning";
};
