import { TopicEventsResponse } from "@/models/ontology.types";

export const getEventsInTopic = async ({ topicID }: { topicID: string }) => {
	if (!topicID || topicID === "") {
		throw new Error("Error while fetching events, no topic ID provided.");
	}

	const response = await fetch(`/api/fetch-events-in-topic/${topicID}`);
	const data: TopicEventsResponse = await response.json();

	if (!data.success) {
		throw new Error(data.error);
	}
	return data.events;
};
