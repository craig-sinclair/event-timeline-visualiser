import fs from "fs";
import path from "path";

import { dbConnect } from "../lib/mongoose";
import { Event } from "../models/event";
import { Timeline, TimelineData } from "../models/timeline";

export async function populateData() {
	await dbConnect();

	try {
		console.log("0) Successfully connected to MongoDB...");

		// Delete existing documents in collections
		await Event.deleteMany({});
		await Timeline.deleteMany({});
		console.log("1) Cleared timelines and events collections successfully...");

		// Load JSON files for events and timelines
		const brexitEventsDataPath = path.join(process.cwd(), "src/app/data/sample-events.json");
		const covidEventsDataPath = path.join(process.cwd(), "src/app/data/sample-covid-data.json");
		const ukClimateEventsDataPath = path.join(
			process.cwd(),
			"src/app/data/sample-uk-climate-data.json"
		);
		const timelinesDataPath = path.join(process.cwd(), "src/app/data/sample-timelines.json");

		const brexitEventsData = JSON.parse(fs.readFileSync(brexitEventsDataPath, "utf-8"));
		const covidEventsData = JSON.parse(fs.readFileSync(covidEventsDataPath, "utf-8"));
		const ukClimateData = JSON.parse(fs.readFileSync(ukClimateEventsDataPath, "utf-8"));
		const timelinesData = JSON.parse(fs.readFileSync(timelinesDataPath, "utf-8"));

		// Add event documents to collection
		const createdBrexitEvents = await Event.insertMany(brexitEventsData);
		console.log(`2) Successfully added ${brexitEventsData.length} Brexit events...`);

		const createdCovidEvents = await Event.insertMany(covidEventsData);
		console.log(`3) Successfully added ${covidEventsData.length} COVID-19 Pandemic events...`);

		const createdUkClimateEvents = await Event.insertMany(ukClimateData);
		console.log(`4) Successfully added ${ukClimateData.length} UK Climate Response events...`);

		// Link event documents for Brexit timeline
		const brexitTimeline = timelinesData.find(
			(t: TimelineData) => t.title === "Brexit Campaign"
		);
		if (brexitTimeline) {
			brexitTimeline.events = createdBrexitEvents.map((e) => e._id);
		}

		// Link event documents for Covid-19 timeline
		const covidTimeline = timelinesData.find(
			(t: TimelineData) => t.title === "COVID-19 Pandemic"
		);
		if (covidTimeline) {
			covidTimeline.events = createdCovidEvents.map((e) => e._id);
		}

		// Link event documents for UK Response to Climate Change timeline
		const ukClimateTimeline = timelinesData.find(
			(t: TimelineData) => t.title === "UK Response to Climate Change"
		);
		if (ukClimateTimeline) {
			ukClimateTimeline.events = createdUkClimateEvents.map((e) => e._id);
		}

		// Add all timeline documents
		await Timeline.insertMany(timelinesData);
		console.log(`5) Successfully added ${timelinesData.length} timelines...`);

		console.log("MongoDB data population script completed!");
		process.exit(0);
	} catch (error) {
		if (error instanceof Error) {
			console.log(
				"An error occurred whilst attempting to populate the database: ",
				error.message
			);
		} else {
			console.log("An unknown error occurred whilst attempting to populate the database!");
		}
		process.exit(1);
	}
}

if (process.argv[1].endsWith("populateData.ts")) {
	populateData();
}
