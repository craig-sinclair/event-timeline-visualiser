vi.mock("@/lib/mongoose", () => ({
	dbConnect: vi.fn(),
}));

vi.mock("@/models/timeline", () => ({
	Timeline: {
		find: vi.fn(),
	},
}));

import { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

import { createMockChain } from "../setupTest";

import { POST } from "@/app/api/fetch-timelines-in-event-tags/route";
import { Timeline } from "@/models/timeline";

describe("Fetch timelines in event tags tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("Throws an error correctly when no tag data is provided", async () => {
		const mockRequest = new NextRequest("http://example", {
			method: "POST",
			body: JSON.stringify({}), // empty body (no tags given)
		});

		const response = await POST(mockRequest);
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve timelines from event tags.");
		expect(data.details).toEqual("Invalid input received for event tags.");
	});

	it("Throws an error correctly when invalid (not-array) tag data is provided", async () => {
		const mockRequest = new NextRequest("http://example", {
			method: "POST",
			body: JSON.stringify({ tags: "invalid data" }),
		});

		const response = await POST(mockRequest);
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve timelines from event tags.");
		expect(data.details).toEqual("Invalid input received for event tags.");
	});

	it("Correctly handles an empty array of tag data, raising error for no valid data", async () => {
		const mockRequest = new NextRequest("http://example", {
			method: "POST",
			body: JSON.stringify({ tags: [] }),
		});

		const response = await POST(mockRequest);
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve timelines from event tags.");
		expect(data.details).toEqual("No valid tag data provided.");
	});

	it("Correctly handles an array of (non-string) tag data, raising error for no valid data", async () => {
		const mockRequest = new NextRequest("http://example", {
			method: "POST",
			body: JSON.stringify({ tags: [0, 1, 2] }),
		});

		const response = await POST(mockRequest);
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve timelines from event tags.");
		expect(data.details).toEqual("No valid tag data provided.");
	});

	it("Returns correct tag to timeline mapping for valid tag input", async () => {
		const mockTimelines = [
			{ _id: "timeline-id-1", tag: "science" },
			{ _id: "timeline-id-2", tag: "history" },
		];
		(Timeline.find as Mock).mockReturnValue(createMockChain(mockTimelines));

		const mockRequest = new NextRequest("http://example", {
			method: "POST",
			body: JSON.stringify({ tags: ["science", "history"] }),
		});

		const response = await POST(mockRequest);
		const data = await response.json();

		expect(data.success).toBe(true);
		expect(data.timelines).toEqual({
			science: "timeline-id-1",
			history: "timeline-id-2",
		});
	});

	it("Correctly handles no matching timelines found", async () => {
		(Timeline.find as Mock).mockReturnValue(createMockChain([])); // no matching timelines found

		const mockRequest = new NextRequest("http://example", {
			method: "POST",
			body: JSON.stringify({ tags: ["science", "history"] }),
		});

		const response = await POST(mockRequest);
		const data = await response.json();

		expect(data.success).toBe(true);
		expect(data.timelines).toEqual({});
	});

	it("Correctly handles limited number of input tags matching", async () => {
		(Timeline.find as Mock).mockReturnValue(
			createMockChain([{ _id: "timeline-id-1", tag: "science" }])
		);

		const mockRequest = new NextRequest("http://example", {
			method: "POST",
			body: JSON.stringify({ tags: ["science", "history"] }),
		});

		const response = await POST(mockRequest);
		const data = await response.json();

		expect(data.success).toBe(true);
		expect(data.timelines).toEqual({ science: "timeline-id-1" });
	});

	it("Correctly handles mix of valid tag input and invalid garbage data", async () => {
		(Timeline.find as Mock).mockReturnValue(
			createMockChain([{ _id: "timeline-id-1", tag: "science" }])
		);

		const mockRequest = new NextRequest("http://example", {
			method: "POST",
			body: JSON.stringify({ tags: ["science", 12345] }),
		});

		const response = await POST(mockRequest);
		const data = await response.json();

		expect(data.success).toBe(true);
		expect(data.timelines).toEqual({ science: "timeline-id-1" });
	});
});
