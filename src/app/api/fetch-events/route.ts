import { NextResponse } from "next/server"
import { EventResponse } from "@/app/models/event";

export async function GET(timelineID?: string) {

    if (!timelineID) {
        const response: EventResponse = {
            success: false,
            error: "Failed to retrieve events from database",
            details: "No timeline ID was provided.",
            timestamp: new Date().toISOString(),
        };
        return NextResponse.json(response);
    }
    const response = {"message": `Given timelineID: ${timelineID}`};
    return NextResponse.json(response);
}