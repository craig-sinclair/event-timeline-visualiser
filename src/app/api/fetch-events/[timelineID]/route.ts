import { NextResponse, NextRequest } from "next/server"
import { EventResponse, EventSchema, EventData } from "@/app/models/event";
import { models, model } from "mongoose"
import { dbConnect } from "@/app/lib/mongoose";

const Event = models.Timeline || model<EventData>("Timeline", EventSchema);

export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<{ timelineID: string }>}
) {
    const { timelineID } = await params;

    if (!timelineID || timelineID === "") {
        const response: EventResponse = {
            success: false,
            error: "Failed to retrieve events from database",
            details: "No timeline ID was provided.",
            timestamp: new Date().toISOString(),
        };
        return NextResponse.json(response);
    };

    await dbConnect();
    const allEvents = await Event.find().lean<EventData[]>();
    const validEvents = allEvents.map((t) => ({
        ...t,
        _id: t._id.toString(), // converts (Mongo) ObjectId -> string
    }));

    const response: EventResponse = {
        success: true,
        message: `Successfully fetched events for timeline ${timelineID}`,
        events: validEvents,
        timestamp: new Date().toISOString(),
    };
    return NextResponse.json(response);
}