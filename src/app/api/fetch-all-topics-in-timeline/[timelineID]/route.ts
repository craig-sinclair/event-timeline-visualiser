import { NextResponse, NextRequest } from "next/server";

import { dbConnect } from "@/lib/mongoose";
import { Event } from "@/models/event";
import { OntologyTopic } from "@/models/ontology";
import { TopicReference } from "@/models/ontology.types";
import { TopicsInTimelineResponse } from "@/models/ontology.types";
import { Timeline } from "@/models/timeline";
import { TimelineData } from "@/models/timeline";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ timelineID: string }> }
) {
	try {
		const { timelineID } = await params;

		if (!timelineID || timelineID === "") {
			throw new Error("No timeline ID was provided.");
		}

		await dbConnect();

		// Verify timeline exists
		const timeline = await Timeline.findById(timelineID).lean<TimelineData | null>();
		if (!timeline) {
			throw new Error("Could not find given timeline.");
		}

		const uniqueQcodesInEvents = await Event.distinct("qcode", {
			_id: { $in: timeline.events },
		});

		const validQCodes = uniqueQcodesInEvents
			.filter((code) => code !== "")
			.map((code) => `medtop:${code}`);

		// Filter empty qcodes and get topic details (qcode and prefLabel required only)
		const validMediaTopics = await OntologyTopic.find(
			{ qcode: { $in: validQCodes } },
			{ qcode: 1, prefLabel: 1, _id: 0 }
		).lean<TopicReference[]>();

		// Remove medtop: prefix from all media topic codes
		const topicsWithStrippedPrefix = validMediaTopics.map((topic) => ({
			qcode: topic.qcode.replace(/^medtop:/, ""),
			prefLabel: topic.prefLabel,
		}));

		const response: TopicsInTimelineResponse = {
			success: true,
			message: `Successfully fetched topics for timeline ${timelineID}`,
			topics: topicsWithStrippedPrefix,
			timestamp: new Date().toISOString(),
		};

		return NextResponse.json(response);
	} catch (err) {
		let errorMessage;
		if (err instanceof Error) {
			errorMessage = err.message;
		} else {
			errorMessage = "An unknown error occurred whilst fetching topic data";
		}

		const response: TopicsInTimelineResponse = {
			success: false,
			error: "Failed to retrieve topics from database",
			details: errorMessage,
			timestamp: new Date().toISOString(),
		};
		return NextResponse.json(response);
	}
}
