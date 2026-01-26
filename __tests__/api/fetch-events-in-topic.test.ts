vi.mock("@/lib/mongoose", () => ({
	dbConnect: vi.fn(),
}));

vi.mock("@/models/timeline", () => ({
	Timeline: {
		find: vi.fn(),
	},
}));

vi.mock("@/models/event", () => ({
	Event: {
		find: vi.fn(),
	},
}));

vi.mock("@/lib/getAllChildTopics", () => ({
	getAllChildTopics: vi.fn(),
}));

import { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

import { GET } from "@/app/api/fetch-events-in-topic/[topicID]/route";
import { getAllChildTopics } from "@/lib/getAllChildTopics";
import { Event } from "@/models/event";
import { EventData } from "@/models/event";
import { EventsInTopic } from "@/models/ontology.types";
import { Timeline } from "@/models/timeline";
import { TimelineData } from "@/models/timeline";

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

// Create object with lean method defined and return mock data
const createMockChain = <T>(returnValue: T) => ({
	lean: vi.fn().mockResolvedValue(returnValue),
});

describe("Fetch events in topic API route tests", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		(getAllChildTopics as Mock).mockResolvedValue([]);
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
		(Timeline.find as Mock).mockReturnValue(createMockChain([mockData.mockSingleTimelineData]));
		(Event.find as Mock).mockReturnValue(createMockChain(mockData.mockEventData));

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
		(Timeline.find as Mock).mockReturnValue(createMockChain([]));

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ topicID: "qcode1" }) });
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve events from database");
		expect(data.details).toEqual("No timelines were found.");
	});

	it("Correctly finds matching events across multiple timelines", async () => {
		(Timeline.find as Mock).mockReturnValue(createMockChain(mockData.mockMultipleTimelineData));
		(Event.find as Mock)
			.mockReturnValueOnce(createMockChain([mockData.mockEventData[0]]))
			.mockReturnValueOnce(createMockChain([mockData.mockEventData[1]]));

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
		(Timeline.find as Mock).mockReturnValue(createMockChain([mockData.mockSingleTimelineData]));
		(Event.find as Mock).mockReturnValue(createMockChain(mockData.mockEventData));

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ topicID: "qcode9" }) });
		const data = await response.json();

		expect(data.success).toEqual(true);
		expect(data.message).toEqual("Successfully fetched event data from topic ID");
		expect(data.events).toEqual([]);
	});

	it("Correctly handles missing event data", async () => {
		(Timeline.find as Mock).mockReturnValue(createMockChain([mockData.mockSingleTimelineData]));
		(Event.find as Mock).mockReturnValue(createMockChain([]));

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ topicID: "qcode1" }) });
		const data = await response.json();

		expect(data.success).toEqual(true);
		expect(data.message).toEqual("Successfully fetched event data from topic ID");
		expect(data.events).toEqual([]);
	});

	it("Correctly includes all events matching child topic IDs", async () => {
		(getAllChildTopics as Mock).mockResolvedValue(["qcode2", "qcode4"]);
		(Timeline.find as Mock).mockReturnValue(createMockChain([mockData.mockSingleTimelineData]));
		(Event.find as Mock).mockReturnValue(createMockChain(mockData.mockEventData));

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ topicID: "qcode1" }) });
		const data = await response.json();

		expect(data.success).toEqual(true);

		// Should find events matching qcode1 (base), or qcode2 (child), or qcode4 (child)
		const expectedResponse: EventsInTopic = [
			{
				timelineId: mockData.mockSingleTimelineData._id,
				timelineName: mockData.mockSingleTimelineData.title,
				events: mockData.mockEventData, // returns both events (qcode1 and qcode2)
			},
		];
		expect(data.events).toEqual(expectedResponse);
	});
});
