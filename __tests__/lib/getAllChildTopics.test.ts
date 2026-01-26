vi.mock("@/lib/mongoose", () => ({
	dbConnect: vi.fn(),
}));

vi.mock("@/models/ontology", () => ({
	OntologyTopic: {
		aggregate: vi.fn(),
		collection: {
			name: "ontology",
		},
	},
}));

import { describe, it, expect, vi, type Mock, beforeEach } from "vitest";

import { getAllChildTopics } from "@/lib/getAllChildTopics";
import { OntologyTopic } from "@/models/ontology";

describe("Get all child topics test", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("Correctly handles empty topic ID parameter", async () => {
		const result = await getAllChildTopics({ topicID: "" });
		expect(result).toEqual([]);
		expect(OntologyTopic.aggregate).not.toHaveBeenCalled();
	});

	it("Correctly handles case where base topic cannot be found", async () => {
		(OntologyTopic.aggregate as Mock).mockResolvedValue([]);
		await expect(getAllChildTopics({ topicID: "999" })).rejects.toThrowError();
	});

	it("Correctly handles topic with no child (narrower) topics", async () => {
		(OntologyTopic.aggregate as Mock).mockResolvedValue([{ childQcodes: [] }]);
		const result = await getAllChildTopics({ topicID: "test" });
		expect(result).toEqual([]);
	});

	it("Correctly handles topic with single child (narrower) topic", async () => {
		(OntologyTopic.aggregate as Mock).mockResolvedValue([{ childQcodes: ["medtop:12345"] }]);
		const result = await getAllChildTopics({ topicID: "test" });
		expect(result).toEqual(["12345"]);
	});

	it("Correctly handles multiple nested children results, removing duplicates", async () => {
		(OntologyTopic.aggregate as Mock).mockResolvedValue([
			{ childQcodes: ["medtop:12345", "medtop:12345", "medtop:2468", "medtop:999"] },
		]);
		const result = await getAllChildTopics({ topicID: "test" });
		expect(result).toEqual(["12345", "2468", "999"]);
	});
});
