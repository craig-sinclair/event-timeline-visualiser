import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/mongoose", () => ({
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
		})),
	};
});

import { GET } from "@/app/api/fetch-timelines/route";

const mockExpectedTimelineData = [
	{ _id: "12345", title: "test", events: ["event0", "event1"], discussionID: 568327 },
	{ _id: "1010", title: "test2", events: ["event2", "event3"], discussionID: 2020 },
];

describe("GET /api/fetch-timelines", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return timelines successfully", async () => {
		mockLean.mockResolvedValue(mockExpectedTimelineData);

		const result = await GET();
		const data = await result.json();

		expect(mockLean).toHaveBeenCalledTimes(1);
		expect(data.success).toBe(true);
		expect(data.message).toEqual("Successfully fetched timelines from database");
		expect(data.timelines).toEqual(mockExpectedTimelineData);
	});

	it("should handle case of empty timelines response", async () => {
		mockLean.mockResolvedValue([]);

		const result = await GET();
		const data = await result.json();

		expect(data.success).toBe(true);
		expect(data.message).toEqual("Successfully fetched timelines from database");
		expect(data.timelines).toEqual([]);
	});

	it("handles database error correctly in response", async () => {
		mockLean.mockRejectedValue(new Error("DB error"));
		const result = await GET();
		const data = await result.json();

		expect(data.success).toBe(false);
		expect(data.error).toEqual("Failed to retrieve timelines from database");
	});
});
