import { NextRequest } from "next/server";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { GET } from "@/app/api/fetch-events-in-topic/[topicID]/route";

vi.mock("@/app/lib/mongoose", () => ({
	dbConnect: vi.fn(),
}));

describe("Fetch events in topic API route tests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("Throws error when no topic given", async () => {
		const mockRequest = {} as NextRequest;
		const response = await GET(mockRequest, { params: Promise.resolve({ topicID: "" }) });
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve events from database");
		expect(data.details).toEqual("No topic ID was provided.");
	});
});
