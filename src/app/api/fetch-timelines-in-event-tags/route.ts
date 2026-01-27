import { NextResponse, NextRequest } from "next/server";

import { dbConnect } from "@/lib/mongoose";
import { TagToTimelineResponse, TagToTimelineMap } from "@/models/timeline";
import { Timeline, TagTimelineData } from "@/models/timeline";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { tags } = body;

		if (!tags || !Array.isArray(tags)) {
			throw new Error("Invalid input received for event tags.");
		}

		// Remove non-string entries, and trim
		const cleanedTagsArray = tags
			.map((tag) => (typeof tag === "string" ? tag.trim() : ""))
			.filter(Boolean);

		if (cleanedTagsArray.length === 0) {
			throw new Error("No valid tag data provided.");
		}

		await dbConnect();

		const relevantTimelines = await Timeline.find(
			{ tag: { $in: cleanedTagsArray } },
			{ _id: 1, tag: 1 }
		).lean<TagTimelineData[]>();

		const tagToTimeline = relevantTimelines.reduce<TagToTimelineMap>((acc, timeline) => {
			acc[timeline.tag] = timeline._id.toString();
			return acc;
		}, {});

		const response: TagToTimelineResponse = {
			success: true,
			message: "Successfully fetched topic hierarchy data from database",
			timelines: tagToTimeline,
			timestamp: new Date().toISOString(),
		};

		return NextResponse.json(response);
	} catch (error) {
		const response: TagToTimelineResponse = {
			success: false,
			error: "Failed to retrieve timelines from event tags.",
			details: error instanceof Error ? error.message : "Unknown error",
			timestamp: new Date().toISOString(),
		};
		return NextResponse.json(response, { status: 500 });
	}
}
