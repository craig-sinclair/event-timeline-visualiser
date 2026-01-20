import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";

import { getAllTimelines } from "@/lib/api/getAllTimelines";
import { TimelineData, TimelineResponse } from "@/models/timeline";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockTimelineData: TimelineData[] = [
	{
		_id: "1",
		title: "Project Alpha Timeline",
		discussionID: 12345,
		events: ["Event 1", "Event 2"],
	},
	{
		_id: "2",
		title: "Project Beta Timeline",
		discussionID: 2456,
		events: ["Event 1", "Event 2"],
	},
];

describe("Get all timelines tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it.each([
		[mockTimelineData, mockTimelineData.length],
		[[mockTimelineData[0]], 1],
		[[], 0],
	])(
		"should fetch and return timelines of various sizes  ",
		async (inputTimeline, expectedLength) => {
			const mockResponse: TimelineResponse = {
				success: true,
				message: "Success",
				timelines: inputTimeline,
				timestamp: "2020-01-01",
			};

			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: vi.fn().mockResolvedValueOnce(mockResponse),
			});
			const result = await getAllTimelines();

			expect(fetch).toHaveBeenCalledTimes(1);
			expect(fetch).toHaveBeenCalledWith("/api/fetch-timelines");
			expect(result).toEqual(inputTimeline);
			expect(result).toHaveLength(expectedLength);
		}
	);

	it("should handle timeline with special characters/ emojis in content", async () => {
		const specialCharTimeline: TimelineData[] = [
			{
				_id: "4",
				title: "Timeline with émojis 🚀 & symbols!@#$%",
				discussionID: 12345,
				events: [],
			},
		];

		const mockResponse: TimelineResponse = {
			success: true,
			message: "Success",
			timelines: specialCharTimeline,
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		const result = await getAllTimelines();
		expect(result[0].title).toBe("Timeline with émojis 🚀 & symbols!@#$%");
	});

	it("should throw error when API returns success: false and error message", async () => {
		const mockResponse: TimelineResponse = {
			success: false,
			error: "Database connection failed",
			details: "Failure in DB",
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		await expect(getAllTimelines()).rejects.toThrow("Database connection failed");
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should throw error when API returns success: false and empty error message", async () => {
		const mockResponse: TimelineResponse = {
			success: false,
			error: "",
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		await expect(getAllTimelines()).rejects.toThrow("");
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should throw error when fetch fails", async () => {
		const fetchError = new Error("Network error");
		mockFetch.mockRejectedValueOnce(fetchError);

		await expect(getAllTimelines()).rejects.toThrow("Network error");
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should handle fetch timeout", async () => {
		const timeoutError = new Error("Request timeout");
		mockFetch.mockRejectedValueOnce(timeoutError);

		await expect(getAllTimelines()).rejects.toThrow("Request timeout");
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should handle null response", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(null),
		});

		await expect(getAllTimelines()).rejects.toThrow();
	});
});
