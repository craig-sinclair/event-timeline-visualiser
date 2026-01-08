import { describe, it, expect } from "vitest";

import { sortEvents } from "@/app/lib/sortEvents";
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

describe("Sort events function tests", () => {
	it("correctly sorts events based on minimum relevance (ascending)", () => {
		const result = sortEvents({ events: mockEventData, sortBy: "relevance-asc" });
		expect(result).toEqual(mockEventData);
	});

	it("correctly sorts events based on minimum relevance (descending)", () => {
		const result = sortEvents({ events: mockEventData, sortBy: "relevance-desc" });
		expect(result).toEqual([...mockEventData].reverse());
	});

	it("correctly sorts events based on datetime (ascending)", () => {
		const result = sortEvents({ events: mockEventData, sortBy: "date-asc" });
		expect(result).toEqual(mockEventData);
	});

	it("correctly sorts events based on datetime (descending)", () => {
		const result = sortEvents({ events: mockEventData, sortBy: "date-desc" });
		expect(result).toEqual([...mockEventData].reverse());
	});
});
