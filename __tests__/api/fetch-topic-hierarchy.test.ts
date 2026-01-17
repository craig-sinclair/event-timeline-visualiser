vi.mock("@/app/lib/mongoose", () => ({
	dbConnect: vi.fn(),
}));

vi.mock("@/app/models/ontology", () => ({
	OntologyTopic: {
		findOne: vi.fn(),
	},
}));

import { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

import { GET } from "@/app/api/fetch-topic-hierarchy/[topicID]/route";
import { OntologyTopic, TopicData, TopicHierarchyData } from "@/app/models/ontology";

const mockData = vi.hoisted(() => {
	const mockBaseTopicResponse: TopicData = {
		_id: "1",
		qcode: "qcode-test",
		uri: "123",
		definition: "123",
		prefLabel: "prefLabel-test",
		broader: [],
		narrower: [],
	};

	return { mockBaseTopicResponse };
});

// Create object with lean method defined and return mock data
const createMockChain = <T>(returnValue: T) => ({
	lean: vi.fn().mockResolvedValue(returnValue),
});

describe("Fetch (ontology) topic hiearchy data API tests", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("Throws error when no topic given", async () => {
		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ topicID: "" }) });
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve topic hierarchy data from database");
		expect(data.details).toEqual("No topic ID was provided.");
	});

	it("Correctly returns topic qcode and prefLabel when given topic with no hierarchy (parent topics)", async () => {
		(OntologyTopic.findOne as Mock).mockReturnValue(
			createMockChain(mockData.mockBaseTopicResponse)
		);

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
		};
		expect(data.topic).toEqual(expectedResponse);
	});
});
