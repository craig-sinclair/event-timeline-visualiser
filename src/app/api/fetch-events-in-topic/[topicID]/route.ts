import { NextResponse, NextRequest } from "next/server";

import { dbConnect } from "@/app/lib/mongoose";
import { TopicEventsResponse } from "@/app/models/ontology";

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

		const mockResponse: TopicEventsResponse = {
			success: true,
			message: "Successfully fetched event data from topic ID",
			events: [],
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
