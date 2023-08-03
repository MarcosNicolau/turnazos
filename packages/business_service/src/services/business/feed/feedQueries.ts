import { prisma } from "config/prisma";
import { Pagination } from "type/pagination";
import { CoordinateLocation } from "types/location";
import { FeedQueryResult } from "types/services/business";
import { getOffset } from "utils/pagination";

export const queryByDistanceRadius = async (
	{ lon, lat }: CoordinateLocation,
	distanceRadiusInMeters: number,
	{ page, size }: Pagination
) => {
	try {
		const result = await prisma.$queryRaw<FeedQueryResult[]>`SELECT 
		bus.id, 
		json_build_object(
		'country', loc.country, 
		'province', loc.province, 
		'locality', loc.locality, 
		'street', loc.street, 
		'number', loc.number, 
		'lon', loc.lon,
		'lat', loc.lat,
		'distance',(ST_MAKEPOINT(lon, lat)::geography <-> ST_MakePoint(${lon},${lat})::geography) / 1000
		) AS location,
		json_build_object(
  		'name', profile.name,
  		'category', profile.category,
  		'slogan', profile.slogan,
  		'description', profile.description,
  		'logo_url', profile.logo_url,
  		'cover_url', profile.cover_url,
  		'rate', profile.rate,
  		'cost_level', profile.cost_level
		) AS profile,
		FROM "Business" as bus
		JOIN "Location" AS loc ON loc.id = bus.location_id
		JOIN "Profile" AS profile on profile.id = bus.profile_id
		WHERE ST_DWithin(ST_MAKEPOINT(lon, lat)::geography, ST_MakePoint(${lon},${lat})::geography, ${distanceRadiusInMeters})
		GROUP BY bus.id, loc.id, profile.id
		ORDER BY (ST_MAKEPOINT(lon, lat)::geography <-> ST_MakePoint(${lon},${lat})::geography)
		LIMIT ${size}
		OFFSET ${getOffset({ page, size })}
		;`;
		return result;
	} catch (err) {
		return Promise.reject(err);
	}
};

export const queryByCategory = async (
	category: string,
	{ lon, lat }: CoordinateLocation,
	{ size, page }: Pagination
) => {
	try {
		const result = await prisma.$queryRaw<FeedQueryResult[]>`SELECT 
		bus.id,
		json_build_object(
		'country', loc.country, 
		'province', loc.province, 
		'locality', loc.locality, 
		'street', loc.street, 
		'number', loc.number, 
		'lon', loc.lon,
		'lat', loc.lat,
		'distance',(ST_MAKEPOINT(lon, lat)::geography <-> ST_MakePoint(${lon},${lat})::geography) / 1000
		) AS location,
		json_build_object(
  		'name', profile.name,
  		'category', profile.category,
  		'slogan', profile.slogan,
  		'description', profile.description,
  		'logo_url', profile.logo_url,
  		'cover_url', profile.cover_url,
  		'rate', profile.rate,
  		'cost_level', profile.cost_level
		) AS profile
		FROM "Business" as bus
		JOIN "Location" as loc ON loc.id = bus.location_id
		JOIN "Profile" AS profile on profile.id = bus.profile_id
		WHERE profile.category = ${category}
		GROUP BY bus.id, loc.id, profile.id
		ORDER BY (ST_MAKEPOINT(lon, lat)::geography <-> ST_MakePoint(${lon},${lat})::geography)
		LIMIT ${size}
		OFFSET ${getOffset({ page, size })}
		;`;
		return result;
	} catch (err) {
		return Promise.reject(err);
	}
};

export const queryBySearch = async (
	search: string,
	{ lon, lat }: CoordinateLocation,
	{ size, page }: Pagination
) => {
	try {
		const result = await prisma.$queryRaw<FeedQueryResult[]>`SELECT
		bus.id,
		json_build_object(
		'country', loc.country, 
		'province', loc.province, 
		'locality', loc.locality, 
		'street', loc.street, 
		'number', loc.number, 
		'lon', loc.lon,
		'lat', loc.lat,
		'distance',(ST_MAKEPOINT(lon, lat)::geography <-> ST_MakePoint(${lon}, ${lat})::geography) / 1000) AS location,
		json_build_object(
  		'name', profile.name,
  		'category', profile.category,
  		'slogan', profile.slogan,
  		'description', profile.description,
  		'logo_url', profile.logo_url,
  		'cover_url', profile.cover_url,
  		'rate', profile.rate,
  		'cost_level', profile.cost_level
		) AS profile
		FROM "Business" as bus
		JOIN "Location" as loc ON loc.id = bus.location_id
		JOIN "Profile" AS profile on profile.id = bus.profile_id
		WHERE SIMLARITY(profile.name, ${search}) > 0.6
		OR WORD_SIMILARITY(profile.category, ${search}) > 0.8
		OR WORD_SIMILARITY(profile.description, ${search}) > 0.6
		OR WORD_SIMILARITY(CONCAT(loc.street, ' ', loc.number), ${search}) > 0.7
		GROUP BY bus.id, loc.id, profile.id
		ORDER BY (ST_MAKEPOINT(lon, lat)::geography <-> ST_MakePoint(${lon}, ${lat})::geography)
		LIMIT ${size}
		OFFSET ${getOffset({ page, size })}
		`;
		return result;
	} catch (err) {
		return Promise.reject(err);
	}
};
