import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/fetch-events/route"

describe("Fetch events test suite", () => {
    it("Should give appropriate error message when no timeline ID give", async () => {
        const response = await GET();
        const data = await response.json();

        expect(data.message).toEqual("No timeline ID provided.");
    });

    it("Should give hello message with appropriate timeline", async () => {
        const exampleTimelineID: String = "test-id-123"
        const response = await GET(exampleTimelineID);
        const data = await response.json();

        expect(data.message).toEqual(`Given timelineID: ${exampleTimelineID}`);
    })
})