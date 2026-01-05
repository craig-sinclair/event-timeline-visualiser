import { EventFiltersState, EventFilterPredicate, SortableEventFields } from "@/app/models/event";

export const filterEvents = <T extends SortableEventFields>({
	events,
	filters,
}: {
	events: T[];
	filters: EventFiltersState;
}): T[] => {
	const predicates: EventFilterPredicate<T>[] = [];

	if (filters.tags && filters.tags.length > 0) {
		predicates.push(
			(event) => !!event.tags && filters.tags.some((tag) => event.tags!.includes(tag))
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

	// Apply all filters on events array, built up from predicates array
	return events.filter((event) => predicates.every((p) => p(event)));
};
