vi.mock("@/lib/mongoose", () => ({
	dbConnect: vi.fn(),
}));

import { NextRequest } from "next/server";
import { describe, it, expect, vi } from "vitest";

import { POST } from "@/app/api/fetch-timelines-in-event-tags/route";

describe("Fetch timelines in event tags tests", () => {
	it("Throws an error correctly when no tag data is provided", async () => {
		const mockRequest = new NextRequest("http://example", {
			method: "POST",
			body: JSON.stringify({}), // empty body (no tags given)
		});

		const response = await POST(mockRequest);
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve timelines from event tags.");
		expect(data.details).toEqual("Invalid input received for event tags.");
	});

	it("Throws an error correctly when invalid (not-array) tag data is provided", async () => {
		const mockRequest = new NextRequest("http://example", {
			method: "POST",
			body: JSON.stringify({ tags: "invalid data" }),
		});

		const response = await POST(mockRequest);
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve timelines from event tags.");
		expect(data.details).toEqual("Invalid input received for event tags.");
	});

	it("Correctly handles an empty array of tag data, raising error for no valid data", async () => {
		const mockRequest = new NextRequest("http://example", {
			method: "POST",
			body: JSON.stringify({ tags: [] }),
		});

		const response = await POST(mockRequest);
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve timelines from event tags.");
		expect(data.details).toEqual("No valid tag data provided.");
	});

	it("Correctly handles an array of (non-string) tag data, raising error for no valid data", async () => {
		const mockRequest = new NextRequest("http://example", {
			method: "POST",
			body: JSON.stringify({ tags: [0, 1, 2] }),
		});

		const response = await POST(mockRequest);
		const data = await response.json();

		expect(data.success).toEqual(false);
		expect(data.error).toEqual("Failed to retrieve timelines from event tags.");
		expect(data.details).toEqual("No valid tag data provided.");
	});
});
