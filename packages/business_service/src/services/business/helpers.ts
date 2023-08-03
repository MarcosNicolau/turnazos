import { Location } from "@prisma/client";
import { NavigationService } from "services/navigation";
import { CoordinateLocation } from "type/location";
import { AppError } from "utils/errors";

export const createLocation = async (
	location: CoordinateLocation
): Promise<Omit<Location, "id">> => {
	try {
		const locationDetails = await NavigationService.reverseGeocoding(location);
		if (!locationDetails)
			return Promise.reject(
				new AppError({ httpCode: 400, message: "The provided location does not exist" })
			);
		return {
			lat: Number(locationDetails.lat),
			lon: Number(locationDetails.lon),
			country: locationDetails.address.country,
			number: Number(locationDetails.address.house_number),
			street: locationDetails.address.road,
			suburb: locationDetails.address.city || locationDetails.address.town,
			state: locationDetails.address.state || locationDetails.address.city,
		};
	} catch (err) {
		return Promise.reject(err);
	}
};
