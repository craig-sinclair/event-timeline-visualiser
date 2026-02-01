import mongoose from "mongoose";
import { Schema, model, Types } from "mongoose";

import { ApiResponseBase } from "@/models/api";
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
	tag?: string;
}

export type TagTimelineData = {
	_id: Types.ObjectId;
	tag: string;
};

export type TagToTimelineMap = Record<string, string>;

export type TimelineResponse = ApiResponseBase<{ timelines: TimelineData[] }>;

export type TagToTimelineResponse = ApiResponseBase<{ timelines: TagToTimelineMap }>;

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
				tag: { type: String },
			},
			{
				collection: "timelines",
				versionKey: false,
			}
		)
	);
