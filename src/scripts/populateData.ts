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
		const brexitEventsDataPath = path.join(process.cwd(), "src/data/sample-events.json");
		const covidEventsDataPath = path.join(process.cwd(), "src/data/sample-covid-data.json");
		const ukClimateEventsDataPath = path.join(
			process.cwd(),
			"src/data/sample-uk-climate-data.json"
		);
		const usClimateEventsDataPath = path.join(
			process.cwd(),
			"src/data/sample-us-climate-data.json"
		);
		const timelinesDataPath = path.join(process.cwd(), "src/data/sample-timelines.json");

		const brexitEventsData = JSON.parse(fs.readFileSync(brexitEventsDataPath, "utf-8"));
		const covidEventsData = JSON.parse(fs.readFileSync(covidEventsDataPath, "utf-8"));
		const ukClimateData = JSON.parse(fs.readFileSync(ukClimateEventsDataPath, "utf-8"));
		const usClimateData = JSON.parse(fs.readFileSync(usClimateEventsDataPath, "utf-8"));
		const timelinesData = JSON.parse(fs.readFileSync(timelinesDataPath, "utf-8"));

		// Add event documents to collection
		const createdBrexitEvents = await Event.insertMany(brexitEventsData);
		console.log(`2) Successfully added ${brexitEventsData.length} Brexit events...`);

		const createdCovidEvents = await Event.insertMany(covidEventsData);
		console.log(`3) Successfully added ${covidEventsData.length} COVID-19 Pandemic events...`);

		const createdUkClimateEvents = await Event.insertMany(ukClimateData);
		console.log(`4) Successfully added ${ukClimateData.length} UK Climate Response events...`);

		const createdUsClimateEvents = await Event.insertMany(usClimateData);
		console.log(`5) Successfully added ${usClimateData.length} US Climate Response events...`);

		// Link event documents for Brexit timeline
		const brexitTimeline = timelinesData.find(
			(t: TimelineData) => t.title === "Brexit Campaign"
		);
		if (brexitTimeline) {
			brexitTimeline.events = createdBrexitEvents.map((e) => e._id);
			brexitTimeline.leftLabel = "Leave";
			brexitTimeline.rightLabel = "Remain";
			brexitTimeline.shortName = "Brexit";
		}

		// Link event documents for Covid-19 timeline
		const covidTimeline = timelinesData.find(
			(t: TimelineData) => t.title === "COVID-19 Pandemic"
		);
		if (covidTimeline) {
			covidTimeline.events = createdCovidEvents.map((e) => e._id);
			covidTimeline.shortName = "COVID";
		}

		// Link event documents for UK Response to Climate Change timeline
		const ukClimateTimeline = timelinesData.find(
			(t: TimelineData) => t.title === "UK Response to Climate Change"
		);
		if (ukClimateTimeline) {
			ukClimateTimeline.events = createdUkClimateEvents.map((e) => e._id);
			ukClimateTimeline.leftLabel = "Climate Skepticism";
			ukClimateTimeline.rightLabel = "Climate Emergency Action";
			ukClimateTimeline.shortName = "UK";
		}

		// Link event documents for US Response to Climate Change timeline
		const usClimateTimeline = timelinesData.find(
			(t: TimelineData) => t.title === "US Response to Climate Change"
		);
		if (usClimateTimeline) {
			usClimateTimeline.events = createdUsClimateEvents.map((e) => e._id);
			usClimateTimeline.leftLabel = "Climate Skepticism";
			usClimateTimeline.rightLabel = "Climate Emergency Action";
			usClimateTimeline.shortName = "US";
		}

		// Add all timeline documents
		await Timeline.insertMany(timelinesData);
		console.log(`6) Successfully added ${timelinesData.length} timelines...`);

		const ukTimelineDoc = await Timeline.findOne({ title: "UK Response to Climate Change" });
		const usTimelineDoc = await Timeline.findOne({ title: "US Response to Climate Change" });

		// Link US Climate timeline with UK Climate timeline
		// Updates both of their comparableTimelines field to add each other's timelineID
		if (ukTimelineDoc && usTimelineDoc) {
			const ukId = ukTimelineDoc._id.toString();
			const usId = usTimelineDoc._id.toString();

			await Timeline.updateOne({ _id: ukId }, { $addToSet: { comparableTimelines: usId } });

			await Timeline.updateOne({ _id: usId }, { $addToSet: { comparableTimelines: ukId } });

			console.log("7) Linked UK and US climate timelines for comparison");
		}

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
