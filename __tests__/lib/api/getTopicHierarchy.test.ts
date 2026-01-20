import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";

import { getTopicHierarchy } from "@/lib/api/getTopicHierarchy";
import { TopicHierarchyResponse, TopicHierarchyData } from "@/models/ontology";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockHierarchyData: TopicHierarchyData = {
	qcode: "qcode-1",
	prefLabel: "test",
	hierarchy: [],
};

const exampleTopicId: string = "test-timeline-id";

describe("Get topic hierarchy tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("Should fetch and return tpoic hierarchy data", async () => {
		const mockResponse: TopicHierarchyResponse = {
			success: true,
			message: "Success",
			topic: mockHierarchyData,
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});
		const result = await getTopicHierarchy({ topicID: exampleTopicId });

		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith(`/api/fetch-topic-hierarchy/${exampleTopicId}`);
		expect(result).toEqual(mockHierarchyData);
	});

	it("Should handle empty hierarchy data response", async () => {
		const mockResponse: TopicHierarchyResponse = {
			success: true,
			message: "Success",
			topic: {} as TopicHierarchyData,
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});
		const result = await getTopicHierarchy({ topicID: exampleTopicId });

		expect(result).toEqual({});
	});

	it("Should throw error when given empty topic id", async () => {
		await expect(getTopicHierarchy({ topicID: "" })).rejects.toThrow(
			"Error while fetching topic hierarchy, no topic ID provided."
		);
	});

	it("Should throw error when API returns success: false and error message", async () => {
		const mockResponse: TopicHierarchyResponse = {
			success: false,
			error: "Database connection failed",
			details: "Failure in DB",
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		await expect(getTopicHierarchy({ topicID: exampleTopicId })).rejects.toThrow(
			"Database connection failed"
		);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("Should throw error when API returns success: false and empty error message", async () => {
		const mockResponse: TopicHierarchyResponse = {
			success: false,
			error: "",
			timestamp: "2020-01-01",
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(mockResponse),
		});

		await expect(getTopicHierarchy({ topicID: exampleTopicId })).rejects.toThrow("");
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("Should throw error when fetch fails", async () => {
		const fetchError = new Error("Network error");
		mockFetch.mockRejectedValueOnce(fetchError);

		await expect(getTopicHierarchy({ topicID: exampleTopicId })).rejects.toThrow(
			"Network error"
		);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it("Should handle null response", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce(null),
		});

		await expect(getTopicHierarchy({ topicID: exampleTopicId })).rejects.toThrow();
	});
});
