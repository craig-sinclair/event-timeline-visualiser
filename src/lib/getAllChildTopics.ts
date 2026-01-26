import { dbConnect } from "@/lib/mongoose";
import { OntologyTopic } from "@/models/ontology";

export async function getAllChildTopics({ topicID }: { topicID: string }): Promise<string[]> {
	if (topicID === "") {
		return [];
	}
	await dbConnect();

	const TOPIC_QCODE_PREFIX = "medtop:";
	const baseQcode = `${TOPIC_QCODE_PREFIX}${topicID}`;

	/*
	Recursively finds all children topics from base using MongoDB's graphLookup
	Traverses, matching by broader field of other topics (including deeply nested children)
	*/
	const result = await OntologyTopic.aggregate([
		{
			$match: { qcode: baseQcode },
		},
		{
			$graphLookup: {
				from: "ontology",
				startWith: "$qcode",
				connectFromField: "qcode",
				connectToField: "broader",
				as: "descendants",
			},
		},
		{
			$project: {
				childQcodes: `$descendants.qcode`,
			},
		},
	]);

	if (!result.length) {
		throw new Error(`Could not find topic with ID: ${topicID}`);
	}
	const allChildTopics: string[] = result[0].childQcodes || [];

	// Remove duplicates and medtop prefix
	return [...new Set(allChildTopics)].map((childTopic) => childTopic.replace(/^medtop:/, ""));
}
