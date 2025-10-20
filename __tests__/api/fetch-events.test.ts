import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/fetch-events/[timelineID]/route"

describe("Fetch events test suite", () => {
    it("Should give appropriate error message when no timeline ID give", async () => {
        const mockRequest = {} as Request
        const response = await GET(mockRequest, { params: {}})
        const data = await response.json();

        expect(data.success).toEqual(false);
        expect(data.error).toEqual("Failed to retrieve events from database");
        expect(data.details).toEqual("No timeline ID was provided.");
    });

    it("Should give hello message with appropriate timeline", async () => {
        const exampleTimelineID: string = "test-id-123"
        const mockRequest = {} as Request
        const response = await GET(mockRequest, { params: {timelineID: exampleTimelineID}})
        const data = await response.json();

        expect(data.message).toEqual(`Given timelineID: ${exampleTimelineID}`);
    })
})