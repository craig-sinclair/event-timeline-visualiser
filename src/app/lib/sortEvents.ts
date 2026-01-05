import { EventSortByOptions } from "@/app/models/event";

export const sortEvents = <
	T extends {
		overview: string;
		dateTime: string;
		relevance?: number;
	},
>({
	events,
	sortBy,
}: {
	events: T[];
	sortBy?: EventSortByOptions;
}): T[] => {
	const sortedEvents = [...events];

	switch (sortBy) {
		case "relevance-desc":
			sortedEvents.sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0));
			break;

		case "relevance-asc":
			sortedEvents.sort((a, b) => (a.relevance ?? 0) - (b.relevance ?? 0));
			break;

		case "date-desc":
			sortedEvents.sort(
				(a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
			);
			break;

		case "date-asc":
			sortedEvents.sort(
				(a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
			);
			break;

		default:
			break;
	}
	return sortedEvents;
};
