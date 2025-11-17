import { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { GET } from "@/app/api/fetch-timeline/[timelineID]/route";

vi.mock("@/app/lib/mongoose", () => ({
	dbConnect: vi.fn(),
}));
const mockLean = vi.fn();

vi.mock("mongoose", async () => {
	const actual = await vi.importActual<typeof import("mongoose")>("mongoose");
	return {
		...actual,
		models: {},
		model: vi.fn(() => ({
			find: () => ({
				lean: mockLean,
			}),
			findById: () => ({
				lean: mockLean,
			}),
		})),
	};
});

const mockExpectedTimelineData = {
	_id: "1010",
	title: "test2",
	events: ["event2", "event3"],
	discussionID: 2020,
};

describe("GET /api/fetch-timeline", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return correct timeline successfully", async () => {
		mockLean.mockResolvedValue(mockExpectedTimelineData);

		const mockRequest = {} as NextRequest;
		const result = await GET(mockRequest, { params: Promise.resolve({ timelineID: "1010" }) });
		const data = await result.json();

		expect(mockLean).toHaveBeenCalledTimes(1);
		expect(data.success).toBe(true);
		expect(data.message).toEqual("Successfully fetched timeline from database");
		expect(data.timelines).toEqual([mockExpectedTimelineData]);
	});

	it("handles database error correctly in response", async () => {
		mockLean.mockRejectedValue(new Error("DB error"));

		const mockRequest = {} as NextRequest;
		const result = await GET(mockRequest, { params: Promise.resolve({ timelineID: "1010" }) });
		const data = await result.json();

		expect(data.success).toBe(false);
		expect(data.error).toEqual("Failed to retrieve timeline from database");
	});

	it("Should give appropriate error message when empty timeline ID given", async () => {
		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ timelineID: "" }) });
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve timeline from database");
		expect(data.details).toEqual("No timeline ID was provided.");
	});

	it("Should give appropriate error message for a timeline ID that does not exist", async () => {
		mockLean.mockResolvedValueOnce(null); // mock to not find matching timeline object

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ timelineID: "example-id" }),
		});
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve timeline from database");
		expect(data.details).toEqual("Could not find given timeline.");
	});
});
