import { describe, it, expect } from "vitest";

import { getAllMediaTopicsInTimeline } from "@/lib/getAllMediaTopicsInTimeline";
import { EventData } from "@/models/event";

describe("Get all media topics in timeline tests", () => {
	it("Returns an empty array for empty events data", () => {
		const result = getAllMediaTopicsInTimeline({ eventsArray: [] });
		expect(result).toEqual([]);
	});

	it("Correctly return array of media topics for single event with single media topic", () => {
		const singleEventData: EventData[] = [
			{
				_id: "12345",
				overview: "test",
				dateTime: "2025-01-01",
				furtherDescription: "test",
				relevance: 0.5,
				URLs: [],
				tags: [],
				qcode: ["1"],
			},
		];

		const result = getAllMediaTopicsInTimeline({ eventsArray: singleEventData });
		expect(result).toEqual(["1"]);
	});

	it("Correctly handles event data with missing media topic field", () => {
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

		const result = getAllMediaTopicsInTimeline({ eventsArray: singleEventData });
		expect(result).toEqual([]);
	});

	it("Correctly returns array of tags for multiple events with multiple media topics", () => {
		const multipleEventsData: EventData[] = [
			{
				_id: "12345",
				overview: "test",
				dateTime: "2025-01-01",
				furtherDescription: "test",
				relevance: 0.5,
				URLs: [],
				tags: [],
				qcode: ["1", "2", "3"],
			},
			{
				_id: "123456",
				overview: "test2",
				dateTime: "2025-01-01",
				furtherDescription: "test2",
				relevance: 0.5,
				URLs: [],
				tags: [],
				qcode: ["4", "5"],
			},
		];

		const result = getAllMediaTopicsInTimeline({ eventsArray: multipleEventsData });
		expect(result).toEqual(["1", "2", "3", "4", "5"]);
	});

	it("Correctly extracts only unique media topics found in events", () => {
		const multipleEventsData: EventData[] = [
			{
				_id: "12345",
				overview: "test",
				dateTime: "2025-01-01",
				furtherDescription: "test",
				relevance: 0.5,
				URLs: [],
				tags: [],
				qcode: ["1", "2", "3"],
			},
			{
				_id: "123456",
				overview: "test2",
				dateTime: "2025-01-01",
				furtherDescription: "test2",
				relevance: 0.5,
				URLs: [],
				tags: [],
				qcode: ["1", "2", "3"],
			},
		];
		const result = getAllMediaTopicsInTimeline({ eventsArray: multipleEventsData });
		expect(result).toEqual(["1", "2", "3"]);
	});
});
