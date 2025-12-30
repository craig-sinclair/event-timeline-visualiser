import { EventData } from "@/app/models/event";

export function getAllTagsInTimeline({ eventsArray }: { eventsArray: EventData[] }) {
	const allTags: string[] = [];
	for (const event of eventsArray) {
		allTags.push(...event.tags);
	}
	return allTags;
}
