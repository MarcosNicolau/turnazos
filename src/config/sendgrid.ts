import emailClient from "@sendgrid/mail";
import { ENV_VARS } from "config/env";

emailClient.setApiKey(ENV_VARS.SENDGRID_API_KEY || "");

export { emailClient };
