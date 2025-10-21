import { EventResponse } from "@/app/models/event"

export const getEventsInTimeline = async ({ timelineID } : { timelineID: string }) => {
    if (! timelineID || timelineID === "") {
        throw new Error("Error while fetching events, no timeline ID provided.");
    }

    const response = await fetch(`/api/fetch-events/${timelineID}`);
    const data: EventResponse = await response.json();

    if (!data.success) {
        throw new Error(data.error);
    }
    return data.events;
};