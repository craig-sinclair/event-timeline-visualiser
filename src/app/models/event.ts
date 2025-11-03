import mongoose from "mongoose";
import { Schema, model } from "mongoose"

export interface EventData {
    _id: string,
    overview: string,
    dateTime: string,
    furtherDescription: string,
    relevance: number,
    URLs: string[]
    tags: string[]
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
    mongoose.models.Event || model<EventData>("Event", new Schema<EventData>({
        overview: { type: String, required: true },
        dateTime: { type: String, required: true },
        relevance: { type: Number, required: true },
        furtherDescription: { type: String },
        URLs: [{ type: String }],
        tags: [{ type: String }],
    }, { 
        collection: "events",
        versionKey: false
    })
);