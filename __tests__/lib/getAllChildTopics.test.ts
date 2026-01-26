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

import { getAllChildTopics } from "@/lib/getAllChildTopics";
import { OntologyTopic } from "@/models/ontology";

describe("Get all child topics test", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("Correctly handles empty topic ID parameter", async () => {
		const result = await getAllChildTopics({ topicID: "" });
		expect(result).toEqual([]);
	});

	it("Correctly handles case where base topic cannot be found", async () => {
		(OntologyTopic.findOne as Mock).mockReturnValue(createMockChain(null));
		await expect(getAllChildTopics({ topicID: "999" })).rejects.toThrowError();
	});
});
