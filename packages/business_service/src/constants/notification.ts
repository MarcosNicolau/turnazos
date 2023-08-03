import { BusinessVerificationStatus } from "constants/business";
export const MAIL_TEMPLATES = {
	BUSINESS: {
		REQUEST_VERIFICATION: "",
	},
} as const;

export const APP_TEMPLATES = {
	BUSINESS: {
		VERIFICATION_STATUS_UPDATE: {
			text: (status: BusinessVerificationStatus) => {
				if (status === "accepted")
					return `La información que enviaste fue analizada y ahora tu negocio esta verificado!`;
				if (status === "failed")
					return `La información que enviaste fue analizada y vimos que no era correcta, podes volver a intentar`;
				return "";
			},
			header: (businessName: string) => `Verificación ${businessName}`,
		},
		CLIENT_ACCESS_GRANTED: {
			text: ({
				access_granted,
				business_name,
			}: {
				access_granted: boolean;
				business_name: string;
			}) =>
				`El negocio ${business_name} ${
					access_granted ? "" : "no"
				} te ha otorgado permiso para comenzar a sacar turnos`,
			header: `Pedido de acceso`,
		},
	},
};
