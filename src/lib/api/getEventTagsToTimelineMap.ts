import { TagToTimelineResponse } from "@/models/timeline";

export const getEventTagsToTimelineMap = async ({ allTagsArray }: { allTagsArray: string[] }) => {
	if (!allTagsArray || allTagsArray.length === 0) {
		throw new Error("Error while fetching timelines mapping to tags, no tags provided.");
	}

	const response = await fetch("/api/fetch-timelines-in-event-tags", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ tags: allTagsArray }),
	});
	const data: TagToTimelineResponse = await response.json();

	if (!data.success) {
		throw new Error(data.error);
	}
	return data.timelines;
};
