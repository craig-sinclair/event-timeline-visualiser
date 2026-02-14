import { describe, it, expect } from "vitest";

import { filterEvents } from "@/lib/filterEvents";
import { EventData } from "@/models/event";

const mockEventData: EventData[] = [
	{
		_id: "12345",
		overview: "example",
		furtherDescription: "test",
		dateTime: "2025-01-01 10:00",
		relevance: 0.5,
		URLs: [],
		tags: [],
		qcode: ["example-1", "example-3"],
	},
	{
		_id: "24680",
		overview: "example-2",
		furtherDescription: "test 2",
		dateTime: "2025-01-02 10:01",
		relevance: 0.9,
		URLs: ["example-123"],
		tags: [],
		qcode: ["example-2", "example-3"],
	},
];

describe("Filter events function tests", () => {
	it("returns empty array if there are no events", () => {
		const result = filterEvents({ events: [], filters: { qcode: [] } });
		expect(result).toEqual([]);
	});

	it("maintains same event array if there are no filters", () => {
		const result = filterEvents({ events: mockEventData, filters: { qcode: [] } });
		expect(result).toEqual(mockEventData);
	});

	it("correctly excludes events from result if missing media topic in filter array", () => {
		const result = filterEvents({
			events: mockEventData,
			filters: { qcode: ["example-2"] },
		});
		expect(result).not.toEqual(mockEventData);
		expect(result).toEqual([mockEventData[1]]);
	});

	it("correctly returns all events where filter media topics matches more than one event", () => {
		const result = filterEvents({
			events: mockEventData,
			filters: { qcode: ["example-3"] },
		});
		expect(result).toEqual(mockEventData);
	});

	it("correctly return no events if none match media topic filter", () => {
		const result = filterEvents({
			events: mockEventData,
			filters: { qcode: ["test-bad-topic"] },
		});
		expect(result).toEqual([]);
	});

	it("correctly applies filters for minimum relevance in event data", () => {
		const result = filterEvents({
			events: mockEventData,
			filters: { qcode: [], minRelevance: 0.6 },
		});
		expect(result).not.toEqual(mockEventData);
		expect(result).toEqual([mockEventData[1]]);
	});

	it("correctly handles redundant filters for minimum relevance in event data", () => {
		const result = filterEvents({
			events: mockEventData,
			filters: { qcode: [], minRelevance: 0.1 },
		});
		expect(result).toEqual(mockEventData);
	});

	it("correctly handles filtering with year for event data that excludes all data", () => {
		const result = filterEvents({
			events: mockEventData,
			filters: { qcode: [], dateRange: "1999" },
		});
		expect(result).toEqual([]);
	});

	it("correctly handles filtering with year for event data that includes all data", () => {
		const result = filterEvents({
			events: mockEventData,
			filters: { qcode: [], dateRange: "2025" },
		});
		expect(result).toEqual(mockEventData);
	});
});
