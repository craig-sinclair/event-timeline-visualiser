import { Schema } from "mongoose"

export interface EventData {
    _id: string,
    overview: string,
    dateTime: string,
    relevance: number,
    URLS: string[]
    tags: string[]
};

export type EventResponse =
  | {
      success: true;
      message: string;
      timelines: EventData[];
      timestamp: string;
    }
  | {
      success: false;
      error: string;
      details?: string;
      timestamp: string;
};

export const EventSchema = new Schema<EventData>(
    {
        overview: {type: String, required: true},
        dateTime: {type: String, required: true},
        relevance: { type: Number, required: true},
        URLS: [{ type: String }],
        tags: [{ type: String }]
    },
    { collection: "events" }
)