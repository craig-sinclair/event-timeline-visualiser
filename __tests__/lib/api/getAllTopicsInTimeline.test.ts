import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";

import { getAllTopicsInTimeline } from "@/lib/api/getAllTopicsInTimeline";
import { TopicReference, TopicsInTimelineResponse } from "@/models/ontology.types";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockTopicData: TopicReference[] = [
	{
		qcode: "20000002",
		prefLabel: "Technology",
	},
	{
		qcode: "20000003",
		prefLabel: "Sports",
	},
];

const exampleTimelineID: string = "test-timeline-id";

describe("Get all topics in timeline tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it.each([
		[mockTopicData, mockTopicData.length],
		[[mockTopicData[0]], 1],
		[[], 0],
	])(
		"should fetch and return topics of various sizes",
		async (inputTopicData, expectedLength) => {
			const mockResponse: TopicsInTimelineResponse = {
				success: true,
				message: "Success",
				topics: inputTopicData,
				timestamp: "2020-01-01",
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: vi.fn().mockResolvedValueOnce(mockResponse),
			});

			const result = await getAllTopicsInTimeline({ timelineID: exampleTimelineID });

			expect(fetch).toHaveBeenCalledTimes(1);
			expect(fetch).toHaveBeenCalledWith(
				`/api/fetch-all-topics-in-timeline/${exampleTimelineID}`
			);
			expect(result).toEqual(inputTopicData);
			expect(result).toHaveLength(expectedLength);
		}
	);

	it("should throw error when given empty timeline id", async () => {
		await expect(getAllTopicsInTimeline({ timelineID: "" })).rejects.toThrow(
			"Error while fetching events, no timeline ID provided."
		);
	});

	it("should handle topics with special characters in prefLabel", async () => {
		const specialCharTopics: TopicReference[] = [
			{
				qcode: "20000004",
				prefLabel: "Technology & Innovation 🚀",
			},
		];

		const mockResponse: TopicsInTimelineResponse = {
			success: true,
			message: "Success",
			topics: specialCharTopics,
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		const result = await getAllTopicsInTimeline({ timelineID: exampleTimelineID });
		expect(result[0].prefLabel).toBe("Technology & Innovation 🚀");
	});

	it("should throw error when API returns success: false and error message", async () => {
		const mockResponse: TopicsInTimelineResponse = {
			success: false,
			error: "Timeline not found",
			details: "Could not find given timeline.",
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		await expect(getAllTopicsInTimeline({ timelineID: exampleTimelineID })).rejects.toThrow(
			"Timeline not found"
		);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should throw error when API returns success: false and empty error message", async () => {
		const mockResponse: TopicsInTimelineResponse = {
			success: false,
			error: "",
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		await expect(getAllTopicsInTimeline({ timelineID: exampleTimelineID })).rejects.toThrow("");
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should throw error when fetch fails", async () => {
		const fetchError = new Error("Network error");
		mockFetch.mockRejectedValueOnce(fetchError);

		await expect(getAllTopicsInTimeline({ timelineID: exampleTimelineID })).rejects.toThrow(
			"Network error"
		);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should handle fetch timeout", async () => {
		const timeoutError = new Error("Request timeout");
		mockFetch.mockRejectedValueOnce(timeoutError);

		await expect(getAllTopicsInTimeline({ timelineID: exampleTimelineID })).rejects.toThrow(
			"Request timeout"
		);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should handle null response", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(null),
		});

		await expect(getAllTopicsInTimeline({ timelineID: exampleTimelineID })).rejects.toThrow();
	});
});
