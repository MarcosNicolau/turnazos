import {
	Profile,
	Location,
	Service,
	Settings,
	PaymentMethods,
	ClientInsights,
	Notification,
} from "@prisma/client";

export type CreateBusiness = {
	user_id: string;
	profile: Omit<Profile, "id">;
	location: {
		lon: number;
		lat: number;
	};
	services: Omit<Service, "id">[];
	settings: Omit<Settings, "id">;
	payment_methods: Omit<PaymentMethods, "id">;
};

export type UpdateBusiness = Partial<Omit<CreateBusiness, "services">> & {
	user_id: string;
};

export type AddServiceArgs = Omit<Service, "id" | "business_id"> & { add_to_branches: boolean };
export type DeleteServiceArgs = Omit<Service, "id" | "business_id"> & {
	delete_from_branches: boolean;
};
export type EditServiceArgs = {
	edit_to_branches: boolean;
	service: Omit<Service, "business_id">;
};

export type FeedQueryResult = {
	//Business id
	id: number;
	location: Omit<Location, "id">;
	profile: Omit<Profile, "id">;
};

export type BusinessAddClient = Omit<ClientInsights, "id"> & {
	user_id: string;
	name: string;
	avatar_url: string;
};

export type BusinessUserRequestAccess = {
	user_id: string;
	name: string;
	avatar_url: string;
	business_id: number;
};

export type CreateNotification = Omit<Notification, "id" | "business_id" | "read">;
