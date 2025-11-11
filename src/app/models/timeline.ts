import mongoose from "mongoose";
import { Schema, model } from "mongoose";

export interface TimelineData {
	_id: string;
	title: string;
	events: string[];
	discussionID: number;
	// for binary 'two-sided' timelines
	multipleView?: boolean;
	sideLabels?: string[];

	// for multi-view 0.0 -> 1.0 scale position based timelines
	continuousScale?: boolean;
	scaleLabels?: {
		start: string;
		end: string;
	};
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
				events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
				discussionID: { type: Number },
				multipleView: { type: Boolean },
				sideLabels: [{ type: String }],
				continuousScale: { type: Boolean },
				scaleLabels: {
					start: { type: String },
					end: { type: String },
				},
			},
			{
				collection: "timelines",
				versionKey: false,
			}
		)
	);
