import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/fetch-events/route"

describe("Fetch events test suite", () => {
    it("Should initially give hello world message", async () => {
        const response = await GET();
        const data = await response.json();

        expect(data.message).toEqual("hello world")
    })
})