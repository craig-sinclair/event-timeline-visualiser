import { TopicsInTimelineResponse } from "@/models/ontology.types";

export async function getAllTopicsInTimeline({ timelineID }: { timelineID: string }) {
	if (!timelineID || timelineID === "") {
		throw new Error("Error while fetching events, no timeline ID provided.");
	}

	const response = await fetch(`/api/fetch-all-topics-in-timeline/${timelineID}`);
	const data: TopicsInTimelineResponse = await response.json();

	if (!data.success) {
		throw new Error(data.error);
	}
	return data.topics;
}
