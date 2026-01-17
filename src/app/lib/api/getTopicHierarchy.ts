import { TopicHierarchyResponse } from "@/app/models/ontology";

export const getTopicHierarchy = async ({ topicID }: { topicID: string }) => {
	if (!topicID || topicID === "") {
		throw new Error("Error while fetching topic hierarchy, no topic ID provided.");
	}

	const response = await fetch(`/api/fetch-topic-hierarchy/${topicID}`);
	const data: TopicHierarchyResponse = await response.json();

	if (!data.success) {
		throw new Error(data.error);
	}
	return data.topic;
};
