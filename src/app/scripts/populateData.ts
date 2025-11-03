import { dbConnect } from "../lib/mongoose"
import { Event } from "../models/event";
import { Timeline, TimelineData } from "../models/timeline";
import fs from "fs";
import path from "path";

async function populateData() {
    await dbConnect();

    try {
        console.log("0) Successfully connected to MongoDB...");

        // Delete existing documents in collections
        await Event.deleteMany({});
        await Timeline.deleteMany({});
        console.log("1) Cleared timelines and events collections successfully...");

        // Load JSON files for events and timelines
        const eventsDataPath = path.join(process.cwd(), "src/app/data/sample-events.json");
        const timelinesDataPath = path.join(process.cwd(), "src/app/data/sample-timelines.json");
        const eventsData = JSON.parse(fs.readFileSync(eventsDataPath, "utf-8"));
        const timelinesData = JSON.parse(fs.readFileSync(timelinesDataPath, "utf-8"));

        // Add event documents to collection
        const createdEvents = await Event.insertMany(eventsData);
        console.log(`2) Successfully added ${eventsData.length} events...`);

        // Link events (for Brexit timeline) to corresponding timeline document
        const brexitTimeline = timelinesData.find((t: TimelineData) => t.title === "Brexit Campaign");
        if (brexitTimeline) {
            brexitTimeline.events = createdEvents.map(e => e._id);
        };

        // Add all timeline documents
        await Timeline.insertMany(timelinesData);
        console.log(`3) Successfully added ${timelinesData.length} timelines...`);

        console.log("MongoDB data population script completed!");
        process.exit(0);
    }

    catch (error) {
        if (error instanceof Error) {
            console.log("An error occurred whilst attempting to populate the database: ", error.message);
        }
        else {
            console.log("An unknown error occurred whilst attempting to populate the database!");
        }
        process.exit(1);
    }
}

populateData();