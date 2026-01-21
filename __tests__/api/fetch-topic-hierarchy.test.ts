vi.mock("@/lib/mongoose", () => ({
	dbConnect: vi.fn(),
}));

vi.mock("@/models/ontology", () => ({
	OntologyTopic: {
		findOne: vi.fn(),
	},
}));

import { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

import { GET } from "@/app/api/fetch-topic-hierarchy/[topicID]/route";
import { OntologyTopic, TopicData, TopicHierarchyData } from "@/models/ontology.types";

const mockData = vi.hoisted(() => {
	const mockBaseTopicResponse: TopicData = {
		_id: "1",
		qcode: "medtop:qcode-test",
		uri: "123",
		definition: "123",
		prefLabel: "prefLabel-test",
		broader: ["qcode-test-2"],
		narrower: [],
	};

	const mockFirstBroaderTopic: TopicData = {
		_id: "2",
		qcode: "medtop:qcode-test-2",
		uri: "123",
		definition: "123",
		prefLabel: "prefLabel-test-2",
		broader: ["qcode-test-3"],
		narrower: ["qcode-test"],
	};

	const mockSecondBroaderTopic: TopicData = {
		_id: "3",
		qcode: "medtop:qcode-test-3",
		uri: "123",
		definition: "123",
		prefLabel: "prefLabel-test-3",
		broader: [],
		narrower: ["qcode-test-2"],
	};

	return { mockBaseTopicResponse, mockFirstBroaderTopic, mockSecondBroaderTopic };
});

// Create object with lean method defined and return mock data
const createMockChain = <T>(returnValue: T) => ({
	lean: vi.fn().mockResolvedValue(returnValue),
});

describe("Fetch (ontology) topic hiearchy data API tests", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("Throws error when empty topic ID string given", async () => {
		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ topicID: "" }) });
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve topic hierarchy data from database");
		expect(data.details).toEqual("No topic ID was provided.");
	});

	it("Correctly returns topic qcode and prefLabel when given topic with no parent", async () => {
		const mockTopicNoParentTopics = { ...mockData.mockBaseTopicResponse };
		mockTopicNoParentTopics.broader = [];

		(OntologyTopic.findOne as Mock).mockReturnValue(createMockChain(mockTopicNoParentTopics));

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ topicID: "qcode-test" }),
		});
		const data = await response.json();

		expect(data.success).toEqual(true);
		expect(data.message).toEqual("Successfully fetched topic hierarchy data from database");

		const expectedResponse: TopicHierarchyData = {
			qcode: mockData.mockBaseTopicResponse.qcode,
			prefLabel: mockData.mockBaseTopicResponse.prefLabel,
			hierarchy: [],
		};
		expect(data.topic).toEqual(expectedResponse);
	});

	it("Correctly throws error where (base) topic ID/qcode did not match any topics in query", async () => {
		(OntologyTopic.findOne as Mock).mockReturnValue(createMockChain(null));
		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ topicID: "qcode-test" }),
		});
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve topic hierarchy data from database");
		expect(data.details).toEqual(`Could not find topic with ID: qcode-test.`);
	});

	it("Correctly returns hierarchy for multiple parent topics", async () => {
		(OntologyTopic.findOne as Mock)
			.mockReturnValueOnce(createMockChain(mockData.mockBaseTopicResponse))
			.mockReturnValueOnce(createMockChain(mockData.mockFirstBroaderTopic))
			.mockReturnValueOnce(createMockChain(mockData.mockSecondBroaderTopic));

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ topicID: "qcode-test" }),
		});
		const data = await response.json();

		expect(data.success).toEqual(true);
		expect(data.message).toEqual("Successfully fetched topic hierarchy data from database");

		const expectedResponse: TopicHierarchyData = {
			qcode: mockData.mockBaseTopicResponse.qcode,
			prefLabel: mockData.mockBaseTopicResponse.prefLabel,
			hierarchy: [
				{
					qcode: mockData.mockFirstBroaderTopic.qcode,
					prefLabel: mockData.mockFirstBroaderTopic.prefLabel,
				},
				{
					qcode: mockData.mockSecondBroaderTopic.qcode,
					prefLabel: mockData.mockSecondBroaderTopic.prefLabel,
				},
			],
		};
		expect(data.topic).toEqual(expectedResponse);
	});

	it("Correctly handles parent topic which cannot be found", async () => {
		(OntologyTopic.findOne as Mock)
			.mockReturnValueOnce(createMockChain(mockData.mockBaseTopicResponse))
			.mockReturnValueOnce(createMockChain(null));

		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, {
			params: Promise.resolve({ topicID: "qcode-test" }),
		});
		const data = await response.json();

		expect(data.success).toEqual(true);
		expect(data.message).toEqual("Successfully fetched topic hierarchy data from database");

		const expectedResponse: TopicHierarchyData = {
			qcode: mockData.mockBaseTopicResponse.qcode,
			prefLabel: mockData.mockBaseTopicResponse.prefLabel,
			hierarchy: [],
		};
		expect(data.topic).toEqual(expectedResponse);
	});
});
