import { ApiResponseBase } from "@/app/models/api";
import { EventData } from "@/app/models/event";

export type TopicData = {
	_id: string;
	qcode: string;
	uri: string;
	definition: string;
	prefLabel: string;
	broader?: string[];
	narrower?: string[];
};

export type EventsInTopic = {
	timelineId: string;
	timelineName: string;
	events: EventData[];
}[];

export type TopicEventsResponse = ApiResponseBase<{ events: EventsInTopic }>;

export type TopicHierarchyData = {
	qcode: string;
	prefLabel: string;
	hierarchy: {
		qcode: string;
		prefLabel: string;
	}[];
};

export type TopicHierarchyResponse = ApiResponseBase<{ topic: TopicHierarchyData }>;
