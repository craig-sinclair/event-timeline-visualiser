import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";


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
            findById: () => ({
                lean: mockLean,
            })
        })),
    };
});

import { GET } from "@/app/api/fetch-events/[timelineID]/route"

describe("Fetch events test suite", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    })

    it("Should give appropriate error message when empty timeline ID given", async () => {
        const mockRequest = {} as NextRequest
        const response = await GET(mockRequest, ({ params: Promise.resolve({ timelineID: "" }) }))
        const data = await response.json();

        expect(data.success).toEqual(false);
        expect(data.error).toEqual("Failed to retrieve events from database");
        expect(data.details).toEqual("No timeline ID was provided.");
    });

    it("Should give appropriate error message for a timeline ID that does not exist", async () => {
        mockLean.mockResolvedValueOnce(null); // mock to not find matching timeline object

        const mockRequest = {} as NextRequest
        const response = await GET(mockRequest, ({ params: Promise.resolve({ timelineID: "example-id" }) }))
        const data = await response.json();

        expect(data.success).toEqual(false);
        expect(data.error).toEqual("Failed to retrieve events from database");
        expect(data.details).toEqual("Could not find given timeline.");   
    });

    it("Should handle Mongo throwing database errors with appropriate return", async () => {
        mockLean.mockRejectedValue(new Error("DB Error"));

        const mockRequest = {} as NextRequest
        const response = await GET(mockRequest, ({ params: Promise.resolve({ timelineID: "example-id" }) }))
        const data = await response.json();

        expect(data.success).toEqual(false);
        expect(data.error).toEqual("Failed to retrieve events from database");
        expect(data.details).toEqual("DB Error");   
    });
})