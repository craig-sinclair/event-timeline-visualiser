import { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { GET } from "@/app/api/fetch-events/[timelineID]/route";
import { EventData } from "@/app/models/event";
import { TimelineData } from "@/app/models/timeline";

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

const mockExpectedTimelineData: TimelineData = {
	_id: "1010",
	title: "test2",
	events: ["12345"],
	discussionID: 2020,
};

const mockSingleEventData: EventData[] = [
	{
		_id: "12345",
		overview: "example",
		furtherDescription: "12345",
		dateTime: "2025-01-01 10:00",
		relevance: 0.5,
		URLs: [],
		tags: [],
	},
];

const mockMultipleEventData: EventData[] = [
	{
		_id: "12345",
		overview: "example",
		furtherDescription: "12345",
		dateTime: "2025-01-01 10:00",
		relevance: 0.5,
		URLs: [],
		tags: [],
	},
	{
		_id: "24680",
		overview: "example-2",
		furtherDescription: "12345",
		dateTime: "2025-01-02 10:01",
		relevance: 0.9,
		URLs: ["example-123"],
		tags: ["example-tag"],
	},
];

describe("Fetch events test suite", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("Should give appropriate error message when empty timeline ID given", async () => {
		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ timelineID: "" }) });
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve events from database");
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
		expect(data.error).toEqual("Failed to retrieve events from database");
		expect(data.details).toEqual("Could not find given timeline.");
	});

	it("Should handle Mongo throwing database errors with appropriate return", async () => {
		mockLean.mockRejectedValue(new Error("DB Error"));

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ timelineID: "example-id" }),
		});
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve events from database");
		expect(data.details).toEqual("DB Error");
	});

	it("Should correctly return empty event data for valid timeline", async () => {
		mockLean.mockResolvedValue([]).mockResolvedValueOnce(mockExpectedTimelineData);
		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ timelineID: "example-id" }),
		});
		const data = await response.json();

		expect(mockLean).toHaveBeenCalled();
		expect(data.success).toEqual(true);
		expect(data.events).toEqual([]);
	});

	it("Should correctly return data for a single event for valid timeline", async () => {
		mockLean
			.mockResolvedValue([])
			.mockResolvedValueOnce(mockExpectedTimelineData)
			.mockResolvedValueOnce(mockSingleEventData);

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ timelineID: "exmaple-id" }),
		});
		const data = await response.json();

		expect(mockLean).toHaveBeenCalledTimes(2); // calls for timeline and event
		expect(data.success).toEqual(true);
		expect(data.events).toEqual(mockSingleEventData);
	});

	it("Should correctly return data for multiple events in valid timeline", async () => {
		mockLean
			.mockResolvedValue([])
			.mockResolvedValueOnce(mockExpectedTimelineData)
			.mockResolvedValueOnce(mockMultipleEventData);

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ timelineID: "exmaple-id" }),
		});
		const data = await response.json();

		expect(mockLean).toHaveBeenCalledTimes(2);
		expect(data.success).toEqual(true);
		expect(data.events).toEqual(mockMultipleEventData);
	});
});
