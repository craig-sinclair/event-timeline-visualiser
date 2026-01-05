import { EventSortByOptions } from "@/app/models/event";

export const sortEvents = <
	T extends {
		overview: string;
		dateTime: string | Date;
		relevance?: number;
	},
>(
	events: T[],
	sortBy?: EventSortByOptions
): T[] => {
	const sortedEvents = [...events];

	switch (sortBy) {
		case "relevance-desc":
			sortedEvents.sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0));
			break;

		case "relevance-asc":
			sortedEvents.sort((a, b) => (a.relevance ?? 0) - (b.relevance ?? 0));
			break;

		default:
			break;
	}
	return sortedEvents;
};
