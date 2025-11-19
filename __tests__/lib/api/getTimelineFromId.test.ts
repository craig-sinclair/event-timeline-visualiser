import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";

import { getTimelineFromId } from "@/app/lib/api/getTimelineFromId";
import { TimelineData, TimelineResponse } from "@/app/models/timeline";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockTimelineId: string = "mock-id-123";

const mockTimelineData: TimelineData = {
	_id: mockTimelineId,
	title: "Project Beta Timeline",
	discussionID: 2456,
	events: ["Event 1", "Event 2"],
};

describe("Get all timeline from ID tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("should fetch and return valid timeline", async () => {
		const mockResponse: TimelineResponse = {
			success: true,
			message: "Success",
			timelines: [mockTimelineData],
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});
		const result = await getTimelineFromId({ timelineID: mockTimelineId });

		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith(`/api/fetch-timeline/${mockTimelineId}`);
		expect(result).toEqual([mockTimelineData]);
		expect(result).toHaveLength(1);
	});

	it("should handle timeline with special characters/ emojis in content", async () => {
		const specialCharTimeline: TimelineData = {
			_id: "4",
			title: "Timeline with émojis 🚀 & symbols!@#$%",
			discussionID: 12345,
			events: [],
		};

		const mockResponse: TimelineResponse = {
			success: true,
			message: "Success",
			timelines: [specialCharTimeline],
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		const result = await getTimelineFromId({ timelineID: mockTimelineId });
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

		await expect(getTimelineFromId({ timelineID: mockTimelineId })).rejects.toThrow(
			"Database connection failed"
		);
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

		await expect(getTimelineFromId({ timelineID: mockTimelineId })).rejects.toThrow("");
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should throw error when fetch fails", async () => {
		const fetchError = new Error("Network error");
		mockFetch.mockRejectedValueOnce(fetchError);

		await expect(getTimelineFromId({ timelineID: mockTimelineId })).rejects.toThrow(
			"Network error"
		);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should handle fetch timeout", async () => {
		const timeoutError = new Error("Request timeout");
		mockFetch.mockRejectedValueOnce(timeoutError);

		await expect(getTimelineFromId({ timelineID: mockTimelineId })).rejects.toThrow(
			"Request timeout"
		);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("should handle null response", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(null),
		});

		await expect(getTimelineFromId({ timelineID: mockTimelineId })).rejects.toThrow();
	});
});
