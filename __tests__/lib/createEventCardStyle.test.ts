import { describe, it, expect } from "vitest";

import { createEventCardStyle } from "@/lib/createEventCardStyle";

const getRemNumericalValue = (value: string) => parseFloat(value);

describe("Create event card style tests", () => {
	it("correctly returns greater size styling values for higher relevance", () => {
		const lowerRelevanceStyling = createEventCardStyle({ relevance: 0.1 });
		const higherRelevanceStyling = createEventCardStyle({ relevance: 0.9 });

		expect(getRemNumericalValue(lowerRelevanceStyling.fontSize)).toBeLessThan(
			getRemNumericalValue(higherRelevanceStyling.fontSize)
		);
		expect(getRemNumericalValue(lowerRelevanceStyling.padding)).toBeLessThan(
			getRemNumericalValue(higherRelevanceStyling.padding)
		);
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

	it("correctly applies multiplier for padding", () => {
		const paddingMultiplier = 0.5;

		const noPaddingMultiplierGiven = createEventCardStyle({ relevance: 0.5 });
		const paddingMultiplierGiven = createEventCardStyle({
			relevance: 0.5,
			paddingMultiplier: paddingMultiplier,
		});

		expect(getRemNumericalValue(noPaddingMultiplierGiven.padding)).toBeGreaterThan(
			getRemNumericalValue(paddingMultiplierGiven.padding) * paddingMultiplier
		);
	});

	it("correctly applies multiplier for font size", () => {
		const fontSizeMultiplier = 0.5;

		const noFontSizeMultiplierGiven = createEventCardStyle({ relevance: 0.5 });
		const fontSizeMultiplierGiven = createEventCardStyle({
			relevance: 0.5,
			fontSizeMultiplier: fontSizeMultiplier,
		});

		expect(getRemNumericalValue(noFontSizeMultiplierGiven.fontSize)).toBeGreaterThan(
			getRemNumericalValue(fontSizeMultiplierGiven.fontSize) * fontSizeMultiplier
		);
	});
});
