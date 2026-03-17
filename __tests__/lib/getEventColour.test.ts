import { describe, expect, it } from "vitest";

import { getEventColour } from "@/lib/getEventColour";

describe("Get event colour tests", () => {
	it("returns the correct rgb string at position 0.0", () => {
		expect(getEventColour(0)).toBe("rgb(220, 38, 38)");
	});

	it("returns the correct rgb string at position 1.0", () => {
		expect(getEventColour(1)).toBe("rgb(34, 197, 94)");
	});

	it("returns the correct rgb string at position 0.5", () => {
		expect(getEventColour(0.5)).toBe("rgb(127, 118, 66)");
	});

	it("returns the correct rgb string at position 0.25", () => {
		expect(getEventColour(0.25)).toBe("rgb(174, 78, 52)");
	});

	it("returns the correct rgb string at position 0.75", () => {
		expect(getEventColour(0.75)).toBe("rgb(81, 157, 80)");
	});

	it("returns a string in rgb() format", () => {
		expect(getEventColour(0.5)).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
	});
});
