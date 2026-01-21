import mongoose from "mongoose";
import { Schema, model } from "mongoose";

import { TopicData } from "@/models/ontology.types";

export const OntologyTopic =
	mongoose.models.OntologyTopic ||
	model<TopicData>(
		"OntologyTopic",
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
