import { describe, it, expect } from "vitest";

import { filterEvents } from "@/app/lib/filterEvents";
import { EventData } from "@/app/models/event";

const mockEventData: EventData[] = [
	{
		_id: "12345",
		overview: "example",
		furtherDescription: "test",
		dateTime: "2025-01-01 10:00",
		relevance: 0.5,
		URLs: [],
		tags: ["example-tag-1", "example-tag-3"],
	},
	{
		_id: "24680",
		overview: "example-2",
		furtherDescription: "test 2",
		dateTime: "2025-01-02 10:01",
		relevance: 0.9,
		URLs: ["example-123"],
		tags: ["example-tag-2", "example-tag-3"],
	},
];

describe("Filter events function tests", () => {
	it("returns empty array if there are no events", () => {
		const result = filterEvents({ events: [], filters: { tags: [] } });
		expect(result).toEqual([]);
	});

	it("maintains same event array if there are no filters", () => {
		const result = filterEvents({ events: mockEventData, filters: { tags: [] } });
		expect(result).toEqual(mockEventData);
	});

	it("correctly excludes events from result if missing tag in filter array", () => {
		const result = filterEvents({
			events: mockEventData,
			filters: { tags: ["example-tag-2"] },
		});
		expect(result).not.toEqual(mockEventData);
		expect(result).toEqual([mockEventData[1]]);
	});

	it("correctly returns all events where filter tag matches more than one event", () => {
		const result = filterEvents({
			events: mockEventData,
			filters: { tags: ["example-tag-3"] },
		});
		expect(result).toEqual(mockEventData);
	});

	it("correctly return no events if none match tag filter", () => {
		const result = filterEvents({ events: mockEventData, filters: { tags: ["test-bad-tag"] } });
		expect(result).toEqual([]);
	});
});
