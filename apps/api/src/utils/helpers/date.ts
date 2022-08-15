import mockdate from "mockdate";
import { addDays } from "date-fns";

export const setFixtureDate = (daysOffset = 0) => {
	return mockdate.set(addDays(new Date("2022-01-07T12:00:00.000Z"), daysOffset));
};
