import { NextResponse } from "next/server";

import { dbConnect } from "@/lib/mongoose";
import { TimelineData, Timeline, TimelineResponse } from "@/models/timeline";

export async function GET() {
	try {
		await dbConnect();

		const allTimelines = await Timeline.find().lean<TimelineData[]>();
		const validTimelines = allTimelines.map((t) => ({
			...t,
			_id: t._id.toString(), // converts (Mongo) ObjectId -> string
		}));

		const response: TimelineResponse = {
			success: true,
			message: "Successfully fetched timelines from database",
			timelines: validTimelines,
			timestamp: new Date().toISOString(),
		};

		return NextResponse.json(response);
	} catch (error) {
		const response: TimelineResponse = {
			success: false,
			error: "Failed to retrieve timelines from database",
			details: error instanceof Error ? error.message : "Unknown error",
			timestamp: new Date().toISOString(),
		};

		return NextResponse.json(response, { status: 500 });
	}
}
