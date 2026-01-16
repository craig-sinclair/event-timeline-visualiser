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
	timeline: EventData[];
}[];

export type TopicEventsResponse =
	| {
			success: true;
			message: string;
			events: EventsInTopic;
			timestamp: string;
	  }
	| {
			success: false;
			error: string;
			details?: string;
			timestamp: string;
	  };
