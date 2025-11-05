import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
    console.log(`[TEST] process.exit called with code ${code}`);
    return undefined as never;
}) as any);

// Mock all external dependencies
vi.mock("@/app/models/event");
vi.mock("@/app/lib/mongoose", () => ({
    dbConnect: vi.fn(),
}));
vi.mock("@/app/models/timeline");
vi.mock("fs");
vi.mock("path");

import { populateData } from "@/app/scripts/populateData";
import { dbConnect } from "@/app/lib/mongoose";
import { Event } from "@/app/models/event";
import { Timeline } from "@/app/models/timeline";
import fs from "fs";
import path from "path";

describe("populateData", () => {
    const mockBrexitEventsData = [
        {
            _id: "event1",
            title: "EU Referendum Announcement",
            date: "2016-02-20",
            description: "Prime Minister announces referendum",
            side: 1
        },
        {
            _id: "event2",
            title: "Brexit Vote",
            date: "2016-06-23",
            description: "UK votes to leave EU",
            side: 0
        }
    ];

    const mockCovidEventsData = [
        {
            _id: "event1",
            title: "EU Referendum Announcement",
            date: "2016-02-20",
            description: "Prime Minister announces referendum"
        },
        {
            _id: "event2",
            title: "Brexit Vote",
            date: "2016-06-23",
            description: "UK votes to leave EU"
        }
    ];

    const mockTimelinesData = [
        {
            title: "Brexit Campaign",
            description: "Timeline of Brexit events",
            events: []
        },
        {
            title: "COVID-19 Pandemic",
            description: "Timeline of COVID-19 events",
            events: []
        }
    ];

    const mockCreatedBrexitEvents = [
        { ...mockBrexitEventsData[0], _id: "createdEvent1" },
        { ...mockBrexitEventsData[1], _id: "createdEvent2" }
    ];


    const mockCreatedCovidEvents = [
        { ...mockCovidEventsData[0], _id: "createdEvent3" },
        { ...mockCovidEventsData[1], _id: "createdEvent4" }
    ];

    beforeEach(async () => {
        vi.clearAllMocks();

        vi.spyOn(console, "log").mockImplementation(() => { });

        vi.mocked(dbConnect).mockResolvedValue(undefined as any);
        vi.mocked(Event.deleteMany).mockResolvedValue({ deletedCount: 0 } as any);
        vi.mocked(Timeline.deleteMany).mockResolvedValue({ deletedCount: 0 } as any);

        vi.mocked(Event.insertMany)
            .mockResolvedValueOnce(mockCreatedBrexitEvents as any) // first call for Brexit
            .mockResolvedValueOnce(mockCreatedCovidEvents as any); // second call for COVID

        vi.mocked(Timeline.insertMany).mockResolvedValue([] as any);

        vi.mocked(path.join).mockImplementation((...args) => args.join("/"));
        vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
            if (filePath.includes("sample-events.json")) {
                return JSON.stringify(mockBrexitEventsData);
            }
            if (filePath.includes("sample-covid-data.json")) {
                return JSON.stringify(mockCovidEventsData)
            }
            if (filePath.includes("sample-timelines.json")) {
                return JSON.stringify(mockTimelinesData);
            }
            return JSON.stringify([]);
        });

        vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
            console.log(`process.exit called with code ${code}`);
            return undefined as never;
        }) as any);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should successfully connect to MongoDB", async () => {
        await populateData();

        expect(dbConnect).toHaveBeenCalledOnce();
        expect(console.log).toHaveBeenCalledWith("0) Successfully connected to MongoDB...");
    });

    it("should clear existing collections before populating", async () => {
        await populateData();

        expect(Event.deleteMany).toHaveBeenCalledWith({});
        expect(Timeline.deleteMany).toHaveBeenCalledWith({});
        expect(console.log).toHaveBeenCalledWith("1) Cleared timelines and events collections successfully...");
    });

    it("should load JSON files from correct paths", async () => {
        await populateData();

        expect(path.join).toHaveBeenCalledWith(process.cwd(), "src/app/data/sample-events.json");
        expect(path.join).toHaveBeenCalledWith(process.cwd(), "src/app/data/sample-timelines.json");
        expect(path.join).toHaveBeenCalledWith(process.cwd(), "src/app/data/sample-covid-data.json");
        expect(fs.readFileSync).toHaveBeenCalledTimes(3);
    });

    it("should insert events into database", async () => {
        await populateData();

        expect(Event.insertMany).toHaveBeenCalledWith(mockBrexitEventsData);
        expect(console.log).toHaveBeenCalledWith(`2) Successfully added ${mockBrexitEventsData.length} Brexit events...`);

        expect(Event.insertMany).toHaveBeenCalledWith(mockCovidEventsData);
        expect(console.log).toHaveBeenCalledWith(`3) Successfully added ${mockCovidEventsData.length} COVID-19 Pandemic events...`);
    });

    it("should link events to Brexit timeline", async () => {
        const timelinesWithBrexit = [...mockTimelinesData];
        vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
            if (filePath.includes("sample-events.json")) {
                return JSON.stringify(mockBrexitEventsData);
            }
            if (filePath.includes("sample-covid-data.json")) {
                return JSON.stringify(mockCovidEventsData);
            }
            if (filePath.includes("sample-timelines.json")) {
                return JSON.stringify(timelinesWithBrexit);
            }
            return "[]";
        });

        await populateData();

        expect(Timeline.insertMany).toHaveBeenCalled();
        const insertedTimelines = vi.mocked(Timeline.insertMany).mock.calls[0][0] as typeof mockTimelinesData;
        const brexitTimeline = insertedTimelines.find(t => t.title === "Brexit Campaign");

        expect(brexitTimeline).toBeDefined();
        expect(brexitTimeline?.events).toBeDefined();
        expect(brexitTimeline?.events).toEqual(["createdEvent1", "createdEvent2"]);
    });

    it("should link events to Covid timeline", async () => {
        const timelinesWithBrexit = [...mockTimelinesData];
        vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
            if (filePath.includes("sample-events.json")) {
                return JSON.stringify(mockBrexitEventsData);
            }
            if (filePath.includes("sample-covid-data.json")) {
                return JSON.stringify(mockCovidEventsData);
            }
            if (filePath.includes("sample-timelines.json")) {
                return JSON.stringify(timelinesWithBrexit);
            }
            return "[]";
        });

        await populateData();

        expect(Timeline.insertMany).toHaveBeenCalled();
        const insertedTimelines = vi.mocked(Timeline.insertMany).mock.calls[0][0] as typeof mockTimelinesData;
        const covidTimeline = insertedTimelines.find(t => t.title === "COVID-19 Pandemic");

        expect(covidTimeline).toBeDefined();
        expect(covidTimeline?.events).toBeDefined();
        expect(covidTimeline?.events).toEqual(["createdEvent3", "createdEvent4"]);
    });

    it("Brexit events not modify Covid timelines", async () => {
        await populateData();

        const insertedTimelines = vi.mocked(Timeline.insertMany).mock.calls[0][0] as typeof mockTimelinesData;
        const covidTimeline = insertedTimelines.find((t: any) => t.title === "COVID-19 Pandemic");

        expect(covidTimeline).toBeDefined();
        expect(covidTimeline?.events).toBeDefined();
        expect(covidTimeline?.events).toEqual(["createdEvent3", "createdEvent4"]);
    });

    it("should insert timelines into database", async () => {
        await populateData();

        expect(Timeline.insertMany).toHaveBeenCalledOnce();
        expect(console.log).toHaveBeenCalledWith(`4) Successfully added ${mockTimelinesData.length} timelines...`);
    });

    it("should log completion message and exit with code 0", async () => {
        await populateData();

        expect(console.log).toHaveBeenCalledWith("MongoDB data population script completed!");
        expect(process.exit).toHaveBeenCalledWith(0);
    });

    it("should execute steps in correct order", async () => {
        await populateData();

        const callOrder = vi.mocked(console.log).mock.calls.map(call => call[0]);

        expect(callOrder[0]).toContain("Successfully connected");
        expect(callOrder[1]).toContain("Cleared timelines and events");
        expect(callOrder[2]).toContain("Successfully added");
        expect(callOrder[2]).toContain("events");
        expect(callOrder[3]).toContain("Successfully added");
        expect(callOrder[3]).toContain("events");
        expect(callOrder[4]).toContain("Successfully added");
        expect(callOrder[4]).toContain("timelines");
        expect(callOrder[5]).toContain("completed");
    });

    it("should handle Event.deleteMany errors", async () => {
        const mockError = new Error("Failed to delete events");
        vi.mocked(Event.deleteMany).mockRejectedValue(mockError);

        await populateData();

        expect(console.log).toHaveBeenCalledWith(
            "An error occurred whilst attempting to populate the database: ",
            "Failed to delete events"
        );
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("should handle Timeline.deleteMany errors", async () => {
        const mockError = new Error("Failed to delete timelines");
        vi.mocked(Timeline.deleteMany).mockRejectedValue(mockError);

        await populateData();

        expect(console.log).toHaveBeenCalledWith(
            "An error occurred whilst attempting to populate the database: ",
            "Failed to delete timelines"
        );
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("should handle file reading errors", async () => {
        const mockError = new Error("File not found");
        vi.mocked(fs.readFileSync).mockImplementation(() => {
            throw mockError;
        });

        await populateData();

        expect(console.log).toHaveBeenCalledWith(
            "An error occurred whilst attempting to populate the database: ",
            "File not found"
        );
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("should handle JSON parsing errors", async () => {
        vi.mocked(fs.readFileSync).mockReturnValue("invalid json{" as any);

        await populateData();

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining("An error occurred whilst attempting to populate the database: "),
            expect.any(String)
        );
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("should handle Timeline.insertMany errors", async () => {
        const mockError = new Error("Failed to insert timelines");
        vi.mocked(Timeline.insertMany).mockRejectedValue(mockError);

        await populateData();

        expect(console.log).toHaveBeenCalledWith(
            "An error occurred whilst attempting to populate the database: ",
            "Failed to insert timelines"
        );
        expect(process.exit).toHaveBeenCalledWith(1);
    });

    it("should handle empty Brexit events array", async () => {
        vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
            if (filePath.includes("sample-events.json")) {
                return JSON.stringify([]);
            }
            if (filePath.includes("sample-covid-data.json")) {
                return JSON.stringify(mockCovidEventsData);
            }
            if (filePath.includes("sample-timelines.json")) {
                return JSON.stringify(mockTimelinesData);
            }
            return "[]";
        });
        vi.mocked(Event.insertMany).mockResolvedValue([] as any);

        await populateData();

        expect(Event.insertMany).toHaveBeenCalledWith([]);
        expect(console.log).toHaveBeenCalledWith("2) Successfully added 0 Brexit events...");

        expect(Event.insertMany).toHaveBeenCalledWith(mockCovidEventsData);
        expect(console.log).toHaveBeenCalledWith(`3) Successfully added ${mockCovidEventsData.length} COVID-19 Pandemic events...`);
    });

    it("should handle empty Covid events array", async () => {
        vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
            if (filePath.includes("sample-events.json")) {
                return JSON.stringify(mockBrexitEventsData);
            }
            if (filePath.includes("sample-covid-data.json")) {
                return JSON.stringify([]);
            }
            if (filePath.includes("sample-timelines.json")) {
                return JSON.stringify(mockTimelinesData);
            }
            return "[]";
        });
        vi.mocked(Event.insertMany).mockResolvedValue([] as any);

        await populateData();

        expect(Event.insertMany).toHaveBeenCalledWith(mockBrexitEventsData);
        expect(console.log).toHaveBeenCalledWith(`2) Successfully added ${mockBrexitEventsData.length} Brexit events...`);

        expect(Event.insertMany).toHaveBeenCalledWith([]);
        expect(console.log).toHaveBeenCalledWith("3) Successfully added 0 COVID-19 Pandemic events...");
    });

    it("should handle empty Covid and Brexit events array", async () => {
        vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
            if (filePath.includes("sample-events.json")) {
                return JSON.stringify([]);
            }
            if (filePath.includes("sample-covid-data.json")) {
                return JSON.stringify([]);
            }
            if (filePath.includes("sample-timelines.json")) {
                return JSON.stringify(mockTimelinesData);
            }
            return "[]";
        });
        vi.mocked(Event.insertMany).mockResolvedValue([] as any);

        await populateData();

        expect(Event.insertMany).toHaveBeenCalledWith([]);
        expect(console.log).toHaveBeenCalledWith("2) Successfully added 0 Brexit events...");

        expect(Event.insertMany).toHaveBeenCalledWith([]);
        expect(console.log).toHaveBeenCalledWith("3) Successfully added 0 COVID-19 Pandemic events...");
    });

    it("should handle empty timelines array", async () => {
        vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
            if (filePath.includes("sample-events.json")) {
                return JSON.stringify(mockBrexitEventsData);
            }
            if (filePath.includes("sample-covid-data.json")) {
                return JSON.stringify(mockCovidEventsData);
            }
            if (filePath.includes("sample-timelines.json")) {
                return JSON.stringify([]);
            }
            return "[]";
        });

        await populateData();

        expect(Timeline.insertMany).toHaveBeenCalledWith([]);
        expect(console.log).toHaveBeenCalledWith("4) Successfully added 0 timelines...");
    });

    it("should handle missing Brexit timeline gracefully", async () => {
        const timelinesWithoutBrexit = [
            {
                title: "Other Timeline",
                description: "Another timeline",
                events: []
            }
        ];

        vi.mocked(fs.readFileSync).mockImplementation((filePath: any) => {
            if (filePath.includes("sample-events.json")) {
                return JSON.stringify(mockBrexitEventsData);
            }
            if (filePath.includes("sample-covid-data.json")) {
                return JSON.stringify(mockCovidEventsData);
            }
            if (filePath.includes("sample-timelines.json")) {
                return JSON.stringify(timelinesWithoutBrexit);
            }
            return "[]";
        });

        await populateData();

        expect(Timeline.insertMany).toHaveBeenCalledWith(timelinesWithoutBrexit);
        expect(process.exit).toHaveBeenCalledWith(0);
    });
});