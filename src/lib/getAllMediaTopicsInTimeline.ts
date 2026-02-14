import { EventData } from "@/models/event";

export function getAllMediaTopicsInTimeline({ eventsArray }: { eventsArray: EventData[] }) {
	const allMediaTopics: string[] = [];
	for (const event of eventsArray) {
		if (event.qcode) {
			allMediaTopics.push(...event.qcode);
		}
	}
	return [...new Set(allMediaTopics)];
}
