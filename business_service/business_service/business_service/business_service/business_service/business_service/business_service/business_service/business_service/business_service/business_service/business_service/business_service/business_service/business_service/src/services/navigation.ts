import { ENV_VARS } from "config/env";
import axios from "axios";
import { NavigationAPIResponse } from "types/services/navigation";
import { CoordinateLocation } from "types/location";

export class NavigationService {
	static reverseGeocoding = async ({ lon, lat }: CoordinateLocation) => {
		try {
			const res = await axios.get<NavigationAPIResponse>(
				`${ENV_VARS.NAVIGATION_SERVICE_URL}/reverse?lon=${lon}&lat=${lat}&format=jsonv2&addressdetails=1&polygon_geojson=1`
			);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		}
	};

	static search = async (search: string, viewbox: number[] = []) => {
		try {
			const viewboxString = viewbox.join(",");
			const res = await axios.get<NavigationAPIResponse>(
				`${ENV_VARS.NAVIGATION_SERVICE_URL}/search?q=${search}&format=jsonv2&addressdetails=1&polygon_geojson=1&viewbox=${viewboxString}&bounded=1`
			);
			return res.data;
		} catch (err) {
			return Promise.reject(err);
		}
	};
}
