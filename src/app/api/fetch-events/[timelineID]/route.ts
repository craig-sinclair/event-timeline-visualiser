import { NextResponse, NextRequest } from "next/server"
import { EventResponse, EventSchema, EventData } from "@/app/models/event";
import { TimelineSchema, TimelineData } from "@/app/models/timeline";
import { models, model } from "mongoose"
import { dbConnect } from "@/app/lib/mongoose";

const Event = models.Event || model<EventData>("Event", EventSchema);
const Timeline = models.Timeline || model<TimelineData>("Timeline", TimelineSchema);

export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<{ timelineID: string }>}
) {
    try {
        const { timelineID } = await params;

        if (!timelineID || timelineID === "") {
            throw new Error("No timeline ID was provided.");
        };

        await dbConnect();

        const timeline = await Timeline.findById(timelineID).lean<TimelineData | null>();
        if (!timeline) {
            throw new Error("Could not find given timeline.");
        }

        // Get timeline from event IDs in timeline's events array
        const allEvents = await Event.find({
            _id: { $in: timeline.events },
        }).lean<EventData[]>();

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
    catch (err) {
        let errorMessage;
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        else {
            errorMessage = "An unknown error occurred whilst fetching events";
        }

        const response: EventResponse = {
            success: false,
            error: "Failed to retrieve events from database",
            details: errorMessage,
            timestamp: new Date().toISOString(),
        };
        return NextResponse.json(response);
    }
}