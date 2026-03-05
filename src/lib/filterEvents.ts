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

	// Ensure event is within filtered start and end date range
	if (filters.dateRange?.start !== undefined || filters.dateRange?.end !== undefined) {
		predicates.push((event) => {
			const t = new Date(event.dateTime).getTime();
			const afterStart = !filters.dateRange?.start || t >= filters.dateRange.start.getTime();
			const beforeEnd = !filters.dateRange?.end || t <= filters.dateRange.end.getTime();
			return afterStart && beforeEnd;
		});
	}

	// Apply all filters on events array, built up from predicates array
	return events.filter((event) => predicates.every((p) => p(event)));
};
