import mongoose from "mongoose";
import { Schema, model } from "mongoose";

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
	hierarchy?: {
		qcode: string;
		prefLabel: string;
	}[];
};

export type TopicHierarchyResponse = ApiResponseBase<{ topic: TopicHierarchyData }>;

export const OntologyTopic =
	mongoose.models.Event ||
	model<TopicData>(
		"Event",
		new Schema<TopicData>(
			{
				qcode: { type: String, required: true },
				uri: { type: String, required: true },
				definition: { type: String, required: true },
				prefLabel: { type: String, required: true },
				broader: [{ type: String }],
				narrower: [{ type: String }],
			},
			{
				collection: "ontology",
				versionKey: false,
			}
		)
	);
