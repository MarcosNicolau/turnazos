import { ENV_VARS } from "config/env";
import { WABAClient } from "whatsapp-business";

export const whatsappClient = new WABAClient({
	accountId: ENV_VARS.WABA_ACCOUNT_ID || "",
	apiToken: ENV_VARS.WABA_API_TOKEN || "",
	phoneId: ENV_VARS.WABA_PHONE_ID || "",
});
