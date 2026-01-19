import { TimelineResponse } from "@/models/timeline";

export const getTimelineFromId = async ({ timelineID }: { timelineID: string }) => {
	const response = await fetch(`/api/fetch-timeline/${timelineID}`);
	const data: TimelineResponse = await response.json();

	if (!data.success) {
		throw new Error(data.error);
	}
	return data.timelines;
};
