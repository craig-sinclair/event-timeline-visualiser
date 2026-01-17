import mongoose from "mongoose";
import { Schema, model } from "mongoose";

import { ApiResponseBase } from "@/app/models/api";

export interface EventData {
	_id: string;
	overview: string;
	dateTime: string;
	furtherDescription: string;
	relevance: number;
	URLs: string[];
	tags: string[];
	side?: 0 | 1; // for binary two-sided timeline events
	position?: number; // for continuous scale timeline events (0.0 -> 1.0 values)
	qcode?: string[]; // link to ontology topic(s)
}

export interface ReactSelectEvent {
	value: string;
	label: string;
}

export interface EventFiltersState {
	tags: string[];
	dateRange?: string;
	minRelevance?: number;
	sortBy?: string;
}

export type SortableEventFields = {
	overview: string;
	dateTime: string;
	relevance?: number;
	tags?: string[];
};

export type EventFilterPredicate<T> = (event: T) => boolean;

export type EventSortByOptions = "relevance-asc" | "relevance-desc" | "date-asc" | "date-desc";

export type CompareTimelineEventData = EventData & {
	timelineSide: 1 | 2;
};

export type EventRelevanceStyling = {
	// Values stored in the rem unit
	padding: string;
	fontSize: string;
};

export type EventResponse = ApiResponseBase<{ events: EventData[] }>;

export const Event =
	mongoose.models.Event ||
	model<EventData>(
		"Event",
		new Schema<EventData>(
			{
				overview: { type: String, required: true },
				dateTime: { type: String, required: true },
				relevance: { type: Number, required: true },
				furtherDescription: { type: String },
				URLs: [{ type: String }],
				tags: [{ type: String }],
				side: { type: Number },
				position: { type: Number },
				qcode: [{ type: String }],
			},
			{
				collection: "events",
				versionKey: false,
			}
		)
	);
