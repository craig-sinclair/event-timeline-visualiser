import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";

import { getEventsInTimeline } from "@/lib/api/getEventsInTimeline";
import { EventData, EventResponse } from "@/models/event";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockEventData: EventData[] = [
	{
		_id: "12345",
		overview: "example",
		furtherDescription: "test",
		dateTime: "2025-01-01 10:00",
		relevance: 0.5,
		URLs: [],
		tags: [],
	},
	{
		_id: "24680",
		overview: "example-2",
		furtherDescription: "test 2",
		dateTime: "2025-01-02 10:01",
		relevance: 0.9,
		URLs: ["example-123"],
		tags: ["example-tag"],
	},
];

const exampleTimelineID: string = "test-timeline-id";

describe("Get events in timeline tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it.each([
		[mockEventData, mockEventData.length],
		[[mockEventData[0]], 1],
		[[], 0],
	])(
		"should fetch and return events of various sizes",
		async (inputEventData, expectedLength) => {
			const mockResponse: EventResponse = {
				success: true,
				message: "Success",
				events: inputEventData,
				timestamp: "2020-01-01",
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: vi.fn().mockResolvedValueOnce(mockResponse),
			});
			const result = await getEventsInTimeline({ timelineID: exampleTimelineID });

			expect(fetch).toHaveBeenCalledTimes(1);
			expect(fetch).toHaveBeenCalledWith(`/api/fetch-events/${exampleTimelineID}`);
			expect(result).toEqual(inputEventData);
			expect(result).toHaveLength(expectedLength);
		}
	);

	it("should throw error when given empty timeline id", async () => {
		await expect(getEventsInTimeline({ timelineID: "" })).rejects.toThrow(
			"Error while fetching events, no timeline ID provided."
		);
	});

	it("should handle event with special characters/ emojis in content", async () => {
		const specialCharTimeline: EventData[] = [
			{
				_id: "4",
				overview: "Timeline with émojis 🚀 & symbols!@#$%",
				furtherDescription: "test",
				dateTime: "2025-01-01 10:00",
				relevance: 0.2,
				URLs: [],
				tags: [],
			},
		];

		const mockResponse: EventResponse = {
			success: true,
			message: "Success",
			events: specialCharTimeline,
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		const result = await getEventsInTimeline({ timelineID: exampleTimelineID });
		expect(result[0].overview).toBe("Timeline with émojis 🚀 & symbols!@#$%");
	});

	it("should throw error when API returns success: false and error message", async () => {
		const mockResponse: EventResponse = {
			success: false,
			error: "Database connection failed",
			details: "Failure in DB",
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		await expect(getEventsInTimeline({ timelineID: exampleTimelineID })).rejects.toThrow(
			"Database connection failed"
		);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should throw error when API returns success: false and empty error message", async () => {
		const mockResponse: EventResponse = {
			success: false,
			error: "",
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		await expect(getEventsInTimeline({ timelineID: exampleTimelineID })).rejects.toThrow("");
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should throw error when fetch fails", async () => {
		const fetchError = new Error("Network error");
		mockFetch.mockRejectedValueOnce(fetchError);

		await expect(getEventsInTimeline({ timelineID: exampleTimelineID })).rejects.toThrow(
			"Network error"
		);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should handle fetch timeout", async () => {
		const timeoutError = new Error("Request timeout");
		mockFetch.mockRejectedValueOnce(timeoutError);

		await expect(getEventsInTimeline({ timelineID: exampleTimelineID })).rejects.toThrow(
			"Request timeout"
		);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should handle null response", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(null),
		});

		await expect(getEventsInTimeline({ timelineID: exampleTimelineID })).rejects.toThrow();
	});
});
