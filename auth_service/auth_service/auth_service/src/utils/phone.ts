import { parsePhoneNumber } from "libphonenumber-js";
import { PhoneIdentifiers } from "types/user";

export const getPhoneNumberInfo = ({ country_code, number }: PhoneIdentifiers) =>
	parsePhoneNumber(`+${country_code}${number}`);

export const validatePhoneNumber = ({ country_code, number }: PhoneIdentifiers) =>
	parsePhoneNumber(`+${country_code}${number}`).isValid();

export const formatPhone = ({ country_code, number }: PhoneIdentifiers) =>
	`${country_code}${number}`;
