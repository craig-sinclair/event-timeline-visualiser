import mongoose from "mongoose"
import { Schema, model } from "mongoose"

export interface TimelineData {
    _id: string,
    title: string,
    events: string[],
    discussionID: number,
    multipleView?: Boolean,
    sideLabels?: string[]
};

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

export const Timeline = mongoose.models.Timeline || model<TimelineData>("Timeline", new Schema<TimelineData>({
    title: { type: String, required: true },
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    discussionID: { type: Number },
    multipleView: { type: Boolean},
    sideLabels: [{ type: String }],
}, { 
  collection: "timelines",
  versionKey: false,
}));
