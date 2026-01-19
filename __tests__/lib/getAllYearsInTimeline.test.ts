import { describe, it, expect } from "vitest";

import { getAllYearsInTimeline } from "@/lib/getAllYearsInTimeline";
import { EventData } from "@/models/event";

describe("Get all years in timeline test", () => {
	it("Returns an empty array for empty events data", () => {
		const result = getAllYearsInTimeline({ eventsArray: [] });
		expect(result).toEqual([]);
	});

	it("Correctly returns single year for single event", () => {
		const singleEventData: EventData[] = [
			{
				_id: "12345",
				overview: "test",
				dateTime: "2025-01-01",
				furtherDescription: "test",
				relevance: 0.5,
				URLs: [],
				tags: [],
			},
		];

		const result = getAllYearsInTimeline({ eventsArray: singleEventData });
		expect(result).toEqual(["2025"]);
	});

	it("Correctly returns array of years for multiple events with multiple different years", () => {
		const multipleEventsData: EventData[] = [
			{
				_id: "12345",
				overview: "test",
				dateTime: "2025-01-01",
				furtherDescription: "test",
				relevance: 0.5,
				URLs: [],
				tags: [],
			},
			{
				_id: "123456",
				overview: "test2",
				dateTime: "2024-01-01",
				furtherDescription: "test2",
				relevance: 0.5,
				URLs: [],
				tags: [],
			},
		];

		const result = getAllYearsInTimeline({ eventsArray: multipleEventsData });
		expect(result).toEqual(["2025", "2024"]);
	});

	it("Correctly extracts only unique year found with events with same year", () => {
		const multipleEventsData: EventData[] = [
			{
				_id: "12345",
				overview: "test",
				dateTime: "2025-01-01",
				furtherDescription: "test",
				relevance: 0.5,
				URLs: [],
				tags: [],
			},
			{
				_id: "123456",
				overview: "test2",
				dateTime: "2025-01-01",
				furtherDescription: "test2",
				relevance: 0.5,
				URLs: [],
				tags: [],
			},
		];
		const result = getAllYearsInTimeline({ eventsArray: multipleEventsData });
		expect(result).toEqual(["2025"]);
	});
});
