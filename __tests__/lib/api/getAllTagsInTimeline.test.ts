import { getAllTagsInTimeline } from "@/app/lib/getAllTagsInTimeline";
import { describe, it, expect } from "vitest";
import { EventData } from "@/app/models/event";

describe("Get all tags in timeline tests", () => {
	it("Returns an empty array for empty events data", () => {
		const result = getAllTagsInTimeline({ eventsArray: [] });
		expect(result).toEqual([]);
	});

    it("Correctly return array of tags for single event with single tag", () => {
        const singleEventData: EventData[] = [{
            _id: "12345",
            overview: "test",
            dateTime: "2025-01-01",
            furtherDescription: "test",
            relevance: 0.5,
            URLs: [],
            tags: ["tag1"]
        }];

        const result = getAllTagsInTimeline({ eventsArray: singleEventData });
        expect(result).toEqual(["tag1"]);
    });

    it("Correctly returns array of tags for multiple events with multiple tags", () => {
        const multipleEventsData: EventData[] = [{
            _id: "12345",
            overview: "test",
            dateTime: "2025-01-01",
            furtherDescription: "test",
            relevance: 0.5,
            URLs: [],
            tags: ["tag1", "tag2", "tag3"]
        },
        {
            _id: "123456",
            overview: "test2",
            dateTime: "2025-01-01",
            furtherDescription: "test2",
            relevance: 0.5,
            URLs: [],
            tags: ["tag4", "tag5"]          
        }];

        const result = getAllTagsInTimeline({ eventsArray: multipleEventsData });
        expect(result).toEqual(["tag1", "tag2", "tag3", "tag4", "tag5"]);
    })
});
