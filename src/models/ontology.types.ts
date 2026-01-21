import { ApiResponseBase } from "@/models/api";
import { EventData } from "@/models/event";

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

export type ParentHierarchyData = {
	qcode: string;
	prefLabel: string;
};

export type TopicHierarchyData = {
	qcode: string;
	prefLabel: string;
	hierarchy: ParentHierarchyData[];
};

export type TopicHierarchyResponse = ApiResponseBase<{ topic: TopicHierarchyData }>;

export enum TopicHierarchyTextSize {
	Small,
	Standard,
}
