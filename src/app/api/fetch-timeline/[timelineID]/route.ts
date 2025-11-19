import { NextResponse, NextRequest } from "next/server";

import { dbConnect } from "@/app/lib/mongoose";
import { TimelineData, Timeline, TimelineResponse } from "@/app/models/timeline";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ timelineID: string }> }
) {
	try {
		await dbConnect();

		const { timelineID } = await params;

		if (!timelineID || timelineID === "") {
			throw new Error("No timeline ID was provided.");
		}

		await dbConnect();

		const timelineObject = await Timeline.findById(timelineID).lean<TimelineData | null>();
		if (!timelineObject) {
			throw new Error("Could not find given timeline.");
		}

		const response: TimelineResponse = {
			success: true,
			message: "Successfully fetched timeline from database",
			timelines: [timelineObject],
			timestamp: new Date().toISOString(),
		};

		return NextResponse.json(response);
	} catch (error) {
		const response: TimelineResponse = {
			success: false,
			error: "Failed to retrieve timeline from database",
			details: error instanceof Error ? error.message : "Unknown error",
			timestamp: new Date().toISOString(),
		};

		return NextResponse.json(response, { status: 500 });
	}
}
