vi.mock("@/lib/mongoose", () => ({ dbConnect: vi.fn() }));

vi.mock("mongoose", async () => {
	const actual = await vi.importActual<typeof import("mongoose")>("mongoose");

	return {
		...actual,
		models: {},
		model: vi.fn(() => ({
			find: vi.fn(),
			findById: vi.fn(),
			distinct: vi.fn(),
		})),
	};
});

import { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Mock } from "vitest";

import { createMockChain } from "../setupTest";

import { GET } from "@/app/api/fetch-all-topics-in-timeline/[timelineID]/route";
import { Event } from "@/models/event";
import { OntologyTopic } from "@/models/ontology";
import { TopicReference } from "@/models/ontology.types";
import { TimelineData } from "@/models/timeline";
import { Timeline } from "@/models/timeline";

const mockExpectedTimelineData: TimelineData = {
	_id: "1010",
	title: "test timeline",
	events: ["12345", "67890"],
	discussionID: 2020,
};

const mockTopicReferencesFromDB: TopicReference[] = [
	{
		qcode: "medtop:20000002",
		prefLabel: "example-1",
	},
	{
		qcode: "medtop:20000003",
		prefLabel: "example-2",
	},
];

const mockTopicReferencesStripped: TopicReference[] = [
	{
		qcode: "20000002",
		prefLabel: "example-1",
	},
	{
		qcode: "20000003",
		prefLabel: "example-2",
	},
];

describe("Fetch timeline topics test suite", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("Should give appropriate error message when empty timeline ID given", async () => {
		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ timelineID: "" }) });
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve topics from database");
		expect(data.details).toEqual("No timeline ID was provided.");
	});

	it("Should give appropriate error message for a timeline ID that does not exist", async () => {
		(Timeline.findById as Mock).mockReturnValue(createMockChain(null));

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ timelineID: "non-existent-id" }),
		});
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve topics from database");
		expect(data.details).toEqual("Could not find given timeline.");
	});

	it("Should handle database errors with appropriate return", async () => {
		(Timeline.findById as Mock).mockReturnValue({
			lean: vi.fn().mockRejectedValue(new Error("DB Connection Error")),
		});

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ timelineID: "example-id" }),
		});
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve topics from database");
		expect(data.details).toEqual("DB Connection Error");
	});

	it("Should correctly return empty topics array for timeline with no topics", async () => {
		(Timeline.findById as Mock).mockReturnValue(createMockChain(mockExpectedTimelineData));
		(Event.distinct as Mock).mockResolvedValue([]);
		(OntologyTopic.find as Mock).mockReturnValue(createMockChain([]));

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ timelineID: "example-id" }),
		});
		const data = await response.json();

		expect(data.success).toEqual(true);
		expect(data.topics).toEqual([]);
	});

	it("Should correctly return topics for timeline with single topic", async () => {
		(Timeline.findById as Mock).mockReturnValue(createMockChain(mockExpectedTimelineData));
		(Event.distinct as Mock).mockResolvedValue(["medtop:20000002"]);
		(OntologyTopic.find as Mock).mockReturnValue(
			createMockChain([mockTopicReferencesFromDB[0]])
		);

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ timelineID: "example-id" }),
		});
		const data = await response.json();

		expect(data.success).toEqual(true);
		expect(data.topics).toEqual([mockTopicReferencesStripped[0]]);
		expect(data.message).toEqual(`Successfully fetched topics for timeline example-id`);
	});

	it("Should correctly return multiple topics for valid timeline", async () => {
		(Timeline.findById as Mock).mockReturnValue(createMockChain(mockExpectedTimelineData));
		(Event.distinct as Mock).mockResolvedValue(["medtop:20000002", "medtop:20000003"]);
		(OntologyTopic.find as Mock).mockReturnValue(createMockChain(mockTopicReferencesFromDB));

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ timelineID: "example-id" }),
		});
		const data = await response.json();

		expect(Event.distinct).toHaveBeenCalledTimes(1);
		expect(data.success).toEqual(true);
		expect(data.topics).toEqual(mockTopicReferencesStripped);
		expect(data.topics).toHaveLength(2);
	});

	it("Should filter out empty string qcodes", async () => {
		(Timeline.findById as Mock).mockReturnValue(createMockChain(mockExpectedTimelineData));
		(Event.distinct as Mock).mockResolvedValue(["medtop:20000002", "", ""]);
		(OntologyTopic.find as Mock).mockReturnValue(
			createMockChain([mockTopicReferencesFromDB[0]])
		);

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ timelineID: "example-id" }),
		});
		const data = await response.json();

		expect(data.success).toEqual(true);
		expect(data.topics).toHaveLength(1);
		expect(data.topics).toEqual([mockTopicReferencesStripped[0]]);
	});
});
