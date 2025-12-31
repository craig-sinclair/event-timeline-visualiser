import { EventData, EventFiltersState } from "@/app/models/event";

export const filterEvents = ({
	events,
	filters,
}: {
	events: EventData[];
	filters: EventFiltersState;
}): EventData[] => {
	let filteredEvents = [...events];

	if (filters.tags && filters.tags.length > 0) {
		filteredEvents = filteredEvents.filter((event) => {
			return filters.tags.some((tag) => event.tags?.includes(tag));
		});
	}

	// Remaining filters for date range/ relevance/ sortby etc

	return filteredEvents;
};
