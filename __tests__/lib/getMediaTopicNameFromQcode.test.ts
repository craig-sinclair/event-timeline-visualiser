vi.mock("@/lib/mongoose", () => ({
	dbConnect: vi.fn(),
}));

vi.mock("@/models/ontology", () => ({
	OntologyTopic: {
		findOne: vi.fn(),
	},
}));

import { describe, it, expect, vi, type Mock, beforeEach } from "vitest";

import { createMockChain } from "../setupTest";

import { getMediaTopicNameFromQcode } from "@/lib/getMediaTopicNameFromQcode";
import { OntologyTopic } from "@/models/ontology";
import { TopicData } from "@/models/ontology.types";

const mockData = vi.hoisted(() => {
	const mockOntologyTopicData: TopicData = {
		_id: "1",
		qcode: "qcode-test",
		uri: "123",
		definition: "123",
		prefLabel: "prefLabel-test",
		broader: ["qcode-test-2"],
		narrower: [],
	};
	return { mockOntologyTopicData };
});

describe("Get media topic name from qcode tests", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});
	it("Returns an empty string when no qcode provided", async () => {
		const result = await getMediaTopicNameFromQcode({ qcode: "" });
		expect(result).toEqual("");
	});

	it("Correctly returns prefLabel when ontology document found", async () => {
		(OntologyTopic.findOne as Mock).mockReturnValue(
			createMockChain(mockData.mockOntologyTopicData)
		);

		const result = await getMediaTopicNameFromQcode({
			qcode: mockData.mockOntologyTopicData.qcode,
		});
		expect(result).toEqual(mockData.mockOntologyTopicData.prefLabel);
	});

	it("Correctly returns an empty string when ontology document not found", async () => {
		(OntologyTopic.findOne as Mock).mockReturnValue(createMockChain(null));
		const result = await getMediaTopicNameFromQcode({ qcode: "test-qcode-not-found" });
		expect(result).toEqual("");
	});
});
