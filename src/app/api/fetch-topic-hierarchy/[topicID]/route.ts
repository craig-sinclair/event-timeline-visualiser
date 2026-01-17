import { NextResponse, NextRequest } from "next/server";

import { dbConnect } from "@/app/lib/mongoose";
import {
	TopicHierarchyData,
	TopicHierarchyResponse,
	OntologyTopic,
	TopicData,
	ParentHierarchyData,
} from "@/app/models/ontology";

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

		const TOPIC_QCODE_PREFIX = "medtop:";
		const baseTopic: TopicData | null = await OntologyTopic.findOne({
			qcode: `${TOPIC_QCODE_PREFIX}${topicID}`,
		}).lean<TopicData>();

		if (!baseTopic) {
			throw new Error(`Could not find topic with ID: ${topicID}.`);
		}

		const hierarchy: ParentHierarchyData[] = [];
		let currentTopic: TopicData | null = baseTopic;

		// Fetch all parent topics (until reaching topic with no broader topic field)
		// Known that there is at most one parent topic (array length 1)
		while (currentTopic?.broader?.[0]) {
			const parentTopic: TopicData | null = await OntologyTopic.findOne({
				qcode: `${TOPIC_QCODE_PREFIX}${currentTopic.broader[0]}`,
			}).lean<TopicData>();

			if (!parentTopic) break;

			hierarchy.push({
				qcode: parentTopic.qcode,
				prefLabel: parentTopic.prefLabel,
			});
			currentTopic = parentTopic;
		}

		const topicHierarchy: TopicHierarchyData = {
			qcode: baseTopic.qcode,
			prefLabel: baseTopic.prefLabel,
			hierarchy: hierarchy,
		};

		const response: TopicHierarchyResponse = {
			success: true,
			message: "Successfully fetched topic hierarchy data from database",
			topic: topicHierarchy,
			timestamp: new Date().toISOString(),
		};

		return NextResponse.json(response);
	} catch (error) {
		const response: TopicHierarchyResponse = {
			success: false,
			error: "Failed to retrieve topic hierarchy data from database",
			details: error instanceof Error ? error.message : "Unknown error",
			timestamp: new Date().toISOString(),
		};

		return NextResponse.json(response, { status: 500 });
	}
}
