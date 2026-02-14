import { EventFiltersState, EventFilterPredicate, SortableEventFields } from "@/models/event";

export const filterEvents = <T extends SortableEventFields>({
	events,
	filters,
}: {
	events: T[];
	filters: EventFiltersState;
}): T[] => {
	const predicates: EventFilterPredicate<T>[] = [];

	if (filters.qcode && filters.qcode.length > 0) {
		predicates.push(
			(event) =>
				!!event.qcode &&
				filters.qcode.some((mediaTopicID) => event.qcode!.includes(mediaTopicID))
		);
	}

	if (
		filters.minRelevance !== undefined &&
		filters.minRelevance >= 0.0 &&
		filters.minRelevance <= 1.0
	) {
		const minRelevance = filters.minRelevance;
		predicates.push(
			(event) => typeof event.relevance === "number" && event.relevance >= minRelevance
		);
	}

	// Ensure substring (year) at start of date matches the filter year
	if (filters.dateRange !== undefined && filters.dateRange !== "") {
		predicates.push(
			(event) =>
				event.dateTime.length >= 4 && event.dateTime.substring(0, 4) === filters.dateRange
		);
	}

	// Apply all filters on events array, built up from predicates array
	return events.filter((event) => predicates.every((p) => p(event)));
};
