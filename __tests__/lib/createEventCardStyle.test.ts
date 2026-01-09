import { describe, it, expect } from "vitest";

import { createEventCardStyle } from "@/app/lib/createEventCardStyle";

describe("Create event card style tests", () => {
	it("correctly returns higher styling values for higher relevance", () => {
		const lowerRelevanceStyling = createEventCardStyle({ relevance: 0.1 });
		const higherRelevanceStyling = createEventCardStyle({ relevance: 0.2 });

		expect(higherRelevanceStyling.fontSize).toBeGreaterThan(lowerRelevanceStyling.fontSize);
		expect(higherRelevanceStyling.padding).toBeGreaterThan(lowerRelevanceStyling.padding);
	});

	it("correctly handles relevance input beyond limit by clamping to 1.0", () => {
		const stylingAtRelevanceOne = createEventCardStyle({ relevance: 1.0 });
		const stylingAtInvalidRelevance = createEventCardStyle({ relevance: 2.0 });

		expect(stylingAtInvalidRelevance).toEqual(stylingAtRelevanceOne);
	});

	it("correctly handles relevance input below minimum by clamping to 0.05", () => {
		const stylingAtInvalidRelevance = createEventCardStyle({ relevance: -5.0 });
		const stylingAtMinimumRelevance = createEventCardStyle({ relevance: 0.05 });

		expect(stylingAtInvalidRelevance).toEqual(stylingAtMinimumRelevance);
	});
});
