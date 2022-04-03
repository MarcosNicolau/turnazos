export const datesInEpoch = {
	historic: 74057,
	yearly: new Date().setDate(new Date().getDate() - 365),
	monthly: new Date().setDate(new Date().getDate() - 30),
	weekly: new Date().setDate(new Date().getDate() - 7),
	yesterday: new Date().setDate(new Date().getDate() - 1),
	daily: Date.now(),
	eighteenYearsBack: new Date().setFullYear(new Date().getFullYear() - 18),
};

export const parseEpochDate = (timestamp: number | string) =>
	new Date(timestamp).toLocaleDateString();

export const parseEpochToFullDate = (timestamp: number | string) =>
	new Date(timestamp).toLocaleString();

//Adds a 0 in front of a single digit number
const addZeroInFront = (date: number) => (date < 10 ? `0${date}` : date);

//Gets the day from seven days ago
const getLastWeekDay = (date: Date) => {
	date.setDate(date.getDate() - 7);
	const day = date.getDate();
	return addZeroInFront(day);
};

export type Timestamps = "weekly" | "yearly" | "monthly" | "historic";

export const getDateInRFC3339 = (timestamp: Timestamps) => {
	//Get dates
	const date = new Date();
	let month = addZeroInFront(date.getMonth());
	const day = getLastWeekDay(date);
	let year = date.getUTCFullYear();
	const yearStarted = Number(month) === 0 && date.getDay() < 7;

	if (yearStarted) {
		year -= 1;
		month = 12;
	}

	if (timestamp === "historic") return new Date(`1980-01-01`).toISOString();
	if (timestamp === "yearly") return new Date(`${year}-01-01`).toISOString();
	if (timestamp === "monthly") return new Date(`${year}-${month}-01`).toISOString();
	if (timestamp === "weekly") return new Date(`${year}-${month}-${day}`).toISOString();
};

export const epochDateToRFC339 = (timestamp: number) => new Date(timestamp).toISOString();

//TO MS
export const secondsToMs = (time: number) => time * 1000;
export const minutesToMs = (time: number) => time * 60000;

//TO MINUTES
export const msToMinutes = (time: number) => time / 60000;
export const secondsToMinutes = (time: number) => time / 60;

//TO SECONDS
export const msToSeconds = (time: number) => time / 1000;
export const minutesToSeconds = (time: number) => time * 60;
export const daysToSeconds = (time: number) => time * 8400;

/**
 *
 * @param time must be in ms
 * @returns
 */
export const formatSecondsInMinutes = (time: number) =>
	new Date(time).toTimeString().split(" ")[0].substring(3);
