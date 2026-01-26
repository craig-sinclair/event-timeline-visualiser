import { dbConnect } from "@/lib/mongoose";
import { OntologyTopic } from "@/models/ontology";
import { TopicData } from "@/models/ontology.types";

export async function getAllChildTopics({ topicID }: { topicID: string }) {
	if (topicID === "") {
		return [];
	}
	await dbConnect();

	const TOPIC_QCODE_PREFIX = "medtop:";
	const baseTopic: TopicData | null = await OntologyTopic.findOne({
		qcode: `${TOPIC_QCODE_PREFIX}${topicID}`,
	}).lean<TopicData>();

	if (!baseTopic) {
		throw new Error(`Could not find topic with ID: ${topicID}.`);
	}

	return [];
}
