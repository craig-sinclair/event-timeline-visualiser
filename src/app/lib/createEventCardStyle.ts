import { EventRelevanceStyling } from "@/app/models/event";
import { baseEventRelevanceStyling } from "@/app/utils/event-styles.const";

export function createEventCardStyle({ relevance }: { relevance: number }): EventRelevanceStyling {
	// Clamp relevance value to be between 0.1 and 1.0
	const minRelevance = 0.05;
	const maxRelevance = 1.0;

	relevance = Math.min(Math.max(relevance, minRelevance), maxRelevance);

	const relevanceWeightedStyles: EventRelevanceStyling = {
		fontSize: `${baseEventRelevanceStyling.fontSize * relevance}rem`,
		padding: `${baseEventRelevanceStyling.padding * relevance}rem`,
	};
	return relevanceWeightedStyles;
}
