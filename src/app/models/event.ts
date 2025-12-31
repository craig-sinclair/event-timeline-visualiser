import mongoose from "mongoose";
import { Schema, model } from "mongoose";

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

export type CompareTimelineEventData = EventData & {
	timelineSide: 1 | 2;
};

export type EventResponse =
	| {
			success: true;
			message: string;
			events: EventData[];
			timestamp: string;
	  }
	| {
			success: false;
			error: string;
			details?: string;
			timestamp: string;
	  };

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
			},
			{
				collection: "events",
				versionKey: false,
			}
		)
	);
