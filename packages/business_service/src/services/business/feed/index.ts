import { queryByCategory, queryByDistanceRadius, queryBySearch } from "./feedQueries";
import { CoordinateLocation } from "type/location";
import { UnknownError } from "utils/error";
import { Pagination } from "type/pagination";

export class BusinessFeedService {
	location: { lon: string; lat: string };

	constructor(location: { lon: string; lat: string }) {
		this.location = location;
	}

	getByDistance = async (
		location: CoordinateLocation,
		distanceInMeters: number,
		pagination: Pagination
	) => {
		try {
			const result = await queryByDistanceRadius(location, distanceInMeters, pagination);
			return result;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
	getByCategory = async (
		category: string,
		location: CoordinateLocation,
		pagination: Pagination
	) => {
		try {
			//Get all the business that match the passed category and order by nearest distance
			const result = await queryByCategory(category, location, pagination);
			return result;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
	getBySearch = async (search: string, location: CoordinateLocation, pagination: Pagination) => {
		try {
			const result = await queryBySearch(search, location, pagination);
			return result;
		} catch (err) {
			return Promise.reject(new UnknownError());
		}
	};
}
