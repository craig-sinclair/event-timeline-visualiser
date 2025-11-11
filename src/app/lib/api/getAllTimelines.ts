import { TimelineResponse } from "@/app/models/timeline";

export const getAllTimelines = async () => {
	const response = await fetch("/api/fetch-timelines");
	const data: TimelineResponse = await response.json();

	if (!data.success) {
		throw new Error(data.error);
	}
	return data.timelines;
};
