import { describe, it, expect } from "vitest";

import { buildYearMonthTree } from "@/lib/buildYearMonthTree";
import { EventData } from "@/models/event";

const makeEvent = (dateTime: string): EventData => ({
	_id: "test",
	overview: "",
	dateTime,
	furtherDescription: "",
	relevance: 1,
	URLs: [],
	tags: [],
});

describe("buildYearMonthTree", () => {
	it("returns empty array for empty input", () => {
		expect(buildYearMonthTree([])).toEqual([]);
	});

	it("handles a single event", () => {
		const result = buildYearMonthTree([makeEvent("2024-03-15T10:00:00")]);
		expect(result).toHaveLength(1);
		expect(result[0].year).toBe("2024");
		expect(result[0].months).toHaveLength(1);
		expect(result[0].months[0].label).toBe("March");
		expect(result[0].months[0].value).toBe("2024-03");
	});

	it("ignores events with malformed dateTime (no month segment)", () => {
		const result = buildYearMonthTree([makeEvent("2024")]);
		expect(result[0].months).toHaveLength(0);
	});

	it("groups events from the same year together", () => {
		const events = [makeEvent("2023-01-01"), makeEvent("2023-06-15"), makeEvent("2023-11-30")];
		const result = buildYearMonthTree(events);
		expect(result).toHaveLength(1);
		expect(result[0].year).toBe("2023");
		expect(result[0].months).toHaveLength(3);
	});

	it("creates separate entries for different years, sorted ascending", () => {
		const events = [makeEvent("2025-01-01"), makeEvent("2022-06-01"), makeEvent("2024-03-01")];
		const result = buildYearMonthTree(events);
		expect(result.map((r) => r.year)).toEqual(["2022", "2024", "2025"]);
	});

	it("deduplicates events in the same year-month", () => {
		const events = [makeEvent("2024-05-01"), makeEvent("2024-05-14"), makeEvent("2024-05-31")];
		const result = buildYearMonthTree(events);
		expect(result[0].months).toHaveLength(1);
		expect(result[0].months[0].value).toBe("2024-05");
	});

	it("sorts months ascending within a year", () => {
		const events = [makeEvent("2024-11-01"), makeEvent("2024-02-01"), makeEvent("2024-07-01")];
		const result = buildYearMonthTree(events);
		expect(result[0].months.map((m) => m.value)).toEqual(["2024-02", "2024-07", "2024-11"]);
	});

	it("year start/end span the full calendar year", () => {
		const result = buildYearMonthTree([makeEvent("2023-06-15")]);
		const { start, end } = result[0];
		expect(start).toEqual(new Date(2023, 0, 1));
		expect(end).toEqual(new Date(2023, 11, 31, 23, 59, 59));
	});

	it("month start is first day and end is last day of that month", () => {
		const result = buildYearMonthTree([makeEvent("2024-02-10")]);
		const feb = result[0].months[0];
		expect(feb.start).toEqual(new Date(2024, 1, 1));
		expect(feb.end).toEqual(new Date(2024, 1, 29, 23, 59, 59));
	});

	it("month end is correct for a 31-day month", () => {
		const result = buildYearMonthTree([makeEvent("2024-01-20")]);
		const jan = result[0].months[0];
		expect(jan.end).toEqual(new Date(2024, 0, 31, 23, 59, 59));
	});
});
