import { NextResponse, NextRequest } from "next/server";

import { dbConnect } from "@/lib/mongoose";
import { EventData } from "@/models/event";
import { Event } from "@/models/event";
import { TopicEventsResponse } from "@/models/ontology";
import { EventsInTopic } from "@/models/ontology";
import { TimelineData } from "@/models/timeline";
import { Timeline } from "@/models/timeline";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ topicID: string }> }
) {
	try {
		const { topicID } = await params;

		if (!topicID || topicID === "") {
			throw new Error("No topic ID was provided.");
		}

		await dbConnect();

		const allTimelines = await Timeline.find().lean<TimelineData[]>();
		if (!Array.isArray(allTimelines) || allTimelines.length === 0) {
			throw new Error("No timelines were found.");
		}

		const allMatchingEventTimelines: EventsInTopic = [];

		for (const timeline of allTimelines) {
			const allTimelineEvents = await Event.find({
				_id: { $in: timeline.events },
			}).lean<EventData[]>();

			const currentTimelineMatchingEvents = [];
			for (const event of allTimelineEvents) {
				if (event.qcode?.includes(topicID)) {
					currentTimelineMatchingEvents.push(event);
				}
			}

			if (currentTimelineMatchingEvents.length > 0) {
				allMatchingEventTimelines.push({
					timelineId: timeline._id.toString(),
					timelineName: timeline.title,
					events: currentTimelineMatchingEvents,
				});
			}
		}

		const mockResponse: TopicEventsResponse = {
			success: true,
			message: "Successfully fetched event data from topic ID",
			events: allMatchingEventTimelines,
			timestamp: new Date().toISOString(),
		};

		return NextResponse.json(mockResponse);
	} catch (error) {
		const response: TopicEventsResponse = {
			success: false,
			error: "Failed to retrieve events from database",
			details: error instanceof Error ? error.message : "Unknown error",
			timestamp: new Date().toISOString(),
		};

		return NextResponse.json(response, { status: 500 });
	}
}
