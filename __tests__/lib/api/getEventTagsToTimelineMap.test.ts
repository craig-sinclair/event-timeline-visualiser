import { describe, it, expect, vi, beforeEach } from "vitest";

import { getEventTagsToTimelineMap } from "@/lib/api/getEventTagsToTimelineMap";
import { TagToTimelineResponse } from "@/models/timeline";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockTagTimelineMapData = {
	science: "123",
	test: "246",
};

describe("Get event tags to timeline map tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("Correctly handles empty tag array provided", async () => {
		await expect(getEventTagsToTimelineMap({ allTagsArray: [] })).rejects.toThrow(
			"Error while fetching timelines mapping to tags, no tags provided."
		);
	});

	it("Correctly returns content of API fetch in valid response", async () => {
		const mockResponse: TagToTimelineResponse = {
			success: true,
			timelines: mockTagTimelineMapData,
			message: "test123",
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});
		const result = await getEventTagsToTimelineMap({ allTagsArray: ["science", "test"] });

		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith("/api/fetch-timelines-in-event-tags", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ tags: ["science", "test"] }),
		});
		expect(result).toEqual(mockTagTimelineMapData);
	});

	it("Should throw an error when API responds with error", async () => {
		const mockResponse: TagToTimelineResponse = {
			success: false,
			error: "Example failure",
			details: "test123",
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		await expect(
			getEventTagsToTimelineMap({ allTagsArray: ["science", "test"] })
		).rejects.toThrow("Example failure");
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("Should handle null response from API with error", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(null),
		});

		await expect(
			getEventTagsToTimelineMap({ allTagsArray: ["science", "test"] })
		).rejects.toThrow();
	});
});
