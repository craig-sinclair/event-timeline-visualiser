import { EventRelevanceStyling } from "@/models/event";
import { baseEventRelevanceStyling } from "@/utils/event-styles.const";

export function createEventCardStyle({
	relevance,
	paddingMultiplier = 1.0,
	fontSizeMultiplier = 1.0,
}: {
	relevance: number;
	paddingMultiplier?: number;
	fontSizeMultiplier?: number;
}): EventRelevanceStyling {
	// Clamp relevance value to be between 0.1 and 1.0
	const minRelevance = 0.05;
	const maxRelevance = 1.0;

	relevance = Math.min(Math.max(relevance, minRelevance), maxRelevance);

	const relevanceWeightedStyles: EventRelevanceStyling = {
		fontSize: `${baseEventRelevanceStyling.fontSize * relevance * fontSizeMultiplier}rem`,
		padding: `${baseEventRelevanceStyling.padding * relevance * paddingMultiplier}rem`,
	};
	return relevanceWeightedStyles;
}
