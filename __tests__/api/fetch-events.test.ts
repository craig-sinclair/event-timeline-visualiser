import { describe, it, expect, vi } from "vitest";

vi.mock("@/app/lib/mongoose", () => ({
    dbConnect: vi.fn(),
}));
const mockLean = vi.fn();

vi.mock("mongoose", async () => {
    const actual = await vi.importActual<typeof import("mongoose")>("mongoose");
    return {
        ...actual,
        models: {},
        model: vi.fn(() => ({
            find: () => ({
                lean: mockLean,
            }),
        })),
    };
});

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
})