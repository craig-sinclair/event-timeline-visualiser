import { EventData } from "@/models/event";

export function getAllYearsInTimeline({ eventsArray }: { eventsArray: EventData[] }) {
	const allYears: string[] = [];
	for (const event of eventsArray) {
		const year = event.dateTime.substring(0, 4);
		allYears.push(year);
	}
	return [...new Set(allYears)];
}
