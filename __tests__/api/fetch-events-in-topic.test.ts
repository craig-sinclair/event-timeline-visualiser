vi.mock("@/app/lib/mongoose", () => ({
	dbConnect: vi.fn(),
}));

vi.mock("@/app/lib/api/getAllTimelines", () => ({
	getAllTimelines: vi.fn(),
}));

vi.mock("@/app/lib/api/getEventsInTimeline", () => ({
	getEventsInTimeline: vi.fn(),
}));

import { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

import { GET } from "@/app/api/fetch-events-in-topic/[topicID]/route";
import { getAllTimelines } from "@/app/lib/api/getAllTimelines";
import { getEventsInTimeline } from "@/app/lib/api/getEventsInTimeline";
import { EventData } from "@/app/models/event";
import { EventsInTopic } from "@/app/models/ontology";
import { TimelineData } from "@/app/models/timeline";

const mockData = vi.hoisted(() => {
	const mockSingleTimelineData: TimelineData = {
		_id: "1",
		title: "test",
		discussionID: 123,
		events: ["test1", "test2"],
	};

	const mockMultipleTimelineData: TimelineData[] = [
		{
			_id: "1",
			title: "test",
			discussionID: 123,
			events: ["test1"],
		},
		{
			_id: "2",
			title: "test2",
			discussionID: 1234,
			events: ["test2"],
		},
	];

	const mockEventData: EventData[] = [
		{
			_id: "test1",
			overview: "123",
			furtherDescription: "123",
			dateTime: "123",
			relevance: 0.5,
			URLs: [],
			tags: [],
			qcode: ["qcode1", "qcode3"],
		},
		{
			_id: "test1",
			overview: "123",
			furtherDescription: "123",
			dateTime: "123",
			relevance: 0.5,
			URLs: [],
			tags: [],
			qcode: ["qcode2", "qcode3"],
		},
	];

	return { mockSingleTimelineData, mockEventData, mockMultipleTimelineData };
});

describe("Fetch events in topic API route tests", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("Throws error when no topic given", async () => {
		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ topicID: "" }) });
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve events from database");
		expect(data.details).toEqual("No topic ID was provided.");
	});

	it("Correctly returns matching events for a given qcode in a single timeline", async () => {
		(getAllTimelines as Mock).mockResolvedValue([mockData.mockSingleTimelineData]);
		(getEventsInTimeline as Mock).mockResolvedValue(mockData.mockEventData);

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ topicID: "qcode1" }) });
		const data = await response.json();

		expect(data.success).toEqual(true);
		expect(data.message).toEqual("Successfully fetched event data from topic ID");

		const expectedResponse: EventsInTopic = [
			{
				timelineId: mockData.mockSingleTimelineData._id,
				timelineName: mockData.mockSingleTimelineData.title,
				events: [mockData.mockEventData[0]],
			},
		];
		expect(data.events).toEqual(expectedResponse);
	});

	it("Correctly throws an error when no timelines are found", async () => {
		(getAllTimelines as Mock).mockResolvedValue([]);

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ topicID: "qcode1" }) });
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve events from database");
		expect(data.details).toEqual("No timelines were found.");
	});

	it("Correctly finds matching events across multiple timelines", async () => {
		(getAllTimelines as Mock).mockResolvedValue(mockData.mockMultipleTimelineData);
		(getEventsInTimeline as Mock)
			.mockResolvedValueOnce([mockData.mockEventData[0]])
			.mockResolvedValueOnce([mockData.mockEventData[1]]);

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ topicID: "qcode3" }) });
		const data = await response.json();

		expect(data.success).toEqual(true);
		expect(data.message).toEqual("Successfully fetched event data from topic ID");

		const expectedResponse: EventsInTopic = [
			{
				timelineId: mockData.mockMultipleTimelineData[0]._id,
				timelineName: mockData.mockMultipleTimelineData[0].title,
				events: [mockData.mockEventData[0]],
			},
			{
				timelineId: mockData.mockMultipleTimelineData[1]._id,
				timelineName: mockData.mockMultipleTimelineData[1].title,
				events: [mockData.mockEventData[1]],
			},
		];
		expect(data.events).toEqual(expectedResponse);
	});

	it("Correctly handles case where no events match search qcode", async () => {
		(getAllTimelines as Mock).mockResolvedValue([mockData.mockSingleTimelineData]);
		(getEventsInTimeline as Mock).mockResolvedValue(mockData.mockEventData);

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ topicID: "qcode9" }) });
		const data = await response.json();

		expect(data.success).toEqual(true);
		expect(data.message).toEqual("Successfully fetched event data from topic ID");
		expect(data.events).toEqual([]);
	});

	it("Correctly handles missing event data", async () => {
		(getAllTimelines as Mock).mockResolvedValue([mockData.mockSingleTimelineData]);
		(getEventsInTimeline as Mock).mockResolvedValue([]);

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ topicID: "qcode1" }) });
		const data = await response.json();

		expect(data.success).toEqual(true);
		expect(data.message).toEqual("Successfully fetched event data from topic ID");
		expect(data.events).toEqual([]);
	});
});
