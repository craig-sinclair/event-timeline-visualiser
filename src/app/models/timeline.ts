import mongoose from "mongoose";
import { Schema, model } from "mongoose";

export interface TimelineData {
	_id: string;
	title: string;
	shortName?: string;
	events: string[];
	discussionID: number;
	// for binary 'two-sided' timelines
	multipleView?: boolean;
	// for multi-view 0.0 -> 1.0 scale position based timelines
	continuousScale?: boolean;
	leftLabel?: string;
	rightLabel?: string;
	// For timelines that can be compared with other timelines (array of timeline IDs)
	comparableTimelines?: string[];
}

export type TimelineResponse =
	| {
			success: true;
			message: string;
			timelines: TimelineData[];
			timestamp: string;
	  }
	| {
			success: false;
			error: string;
			details?: string;
			timestamp: string;
	  };

export const Timeline =
	mongoose.models.Timeline ||
	model<TimelineData>(
		"Timeline",
		new Schema<TimelineData>(
			{
				title: { type: String, required: true },
				shortName: { type: String },
				events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
				discussionID: { type: Number },
				multipleView: { type: Boolean },
				leftLabel: { type: String },
				rightLabel: { type: String },
				continuousScale: { type: Boolean },
				comparableTimelines: [{ type: String }],
			},
			{
				collection: "timelines",
				versionKey: false,
			}
		)
	);
