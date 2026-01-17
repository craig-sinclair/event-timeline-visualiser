import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";

import { getEventsInTopic } from "@/app/lib/api/getEventsInTopic";
import { TopicEventsResponse, EventsInTopic } from "@/app/models/ontology";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockEventTopicData: EventsInTopic = [
	{
		timelineId: "123",
		timelineName: "123",
		events: [
			{
				_id: "123",
				overview: "example",
				furtherDescription: "test",
				dateTime: "2025-01-01 10:00",
				relevance: 0.5,
				URLs: [],
				tags: [],
				qcode: ["qcode1"],
			},
		],
	},
];

const exampleTopicId: string = "test-timeline-id";

describe("Get events in topic tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it.each([
		[mockEventTopicData, mockEventTopicData.length],
		[[], 0],
	])(
		"should fetch and return events (in topic) of various sizes",
		async (inputEventData, expectedLength) => {
			const mockResponse: TopicEventsResponse = {
				success: true,
				message: "Success",
				events: inputEventData,
				timestamp: "2020-01-01",
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: vi.fn().mockResolvedValueOnce(mockResponse),
			});
			const result = await getEventsInTopic({ topicID: exampleTopicId });

			expect(fetch).toHaveBeenCalledTimes(1);
			expect(fetch).toHaveBeenCalledWith(`/api/fetch-events-in-topic/${exampleTopicId}`);
			expect(result).toEqual(inputEventData);
			expect(result).toHaveLength(expectedLength);
		}
	);

	it("should throw error when given empty topic id", async () => {
		await expect(getEventsInTopic({ topicID: "" })).rejects.toThrow(
			"Error while fetching events, no topic ID provided."
		);
	});

	it("should throw error when API returns success: false and error message", async () => {
		const mockResponse: TopicEventsResponse = {
			success: false,
			error: "Database connection failed",
			details: "Failure in DB",
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		await expect(getEventsInTopic({ topicID: exampleTopicId })).rejects.toThrow(
			"Database connection failed"
		);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should throw error when API returns success: false and empty error message", async () => {
		const mockResponse: TopicEventsResponse = {
			success: false,
			error: "",
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		await expect(getEventsInTopic({ topicID: exampleTopicId })).rejects.toThrow("");
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should throw error when fetch fails", async () => {
		const fetchError = new Error("Network error");
		mockFetch.mockRejectedValueOnce(fetchError);

		await expect(getEventsInTopic({ topicID: exampleTopicId })).rejects.toThrow(
			"Network error"
		);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should handle null response", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(null),
		});

		await expect(getEventsInTopic({ topicID: exampleTopicId })).rejects.toThrow();
	});
});
