import fs from "fs";
import path from "path";

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
	console.log(`[TEST] process.exit called with code ${code}`);
	return undefined as never;
}) as unknown as typeof process.exit);

// Mock all external dependencies
vi.mock("@/app/models/event");
vi.mock("@/app/lib/mongoose", () => ({
	dbConnect: vi.fn(),
}));
vi.mock("@/app/models/timeline");
vi.mock("fs");
vi.mock("path");

import { dbConnect } from "@/app/lib/mongoose";
import { Event } from "@/app/models/event";
import { Timeline } from "@/app/models/timeline";
import { populateData } from "@/app/scripts/populateData";

describe("populateData", () => {
	const mockBrexitEventsData = [
		{
			_id: "event1",
			title: "EU Referendum Announcement",
			date: "2016-02-20",
			description: "Prime Minister announces referendum",
			side: 1,
		},
		{
			_id: "event2",
			title: "Brexit Vote",
			date: "2016-06-23",
			description: "UK votes to leave EU",
			side: 0,
		},
	];

	const mockCovidEventsData = [
		{
			_id: "event1",
			title: "EU Referendum Announcement",
			date: "2016-02-20",
			description: "Prime Minister announces referendum",
		},
		{
			_id: "event2",
			title: "Brexit Vote",
			date: "2016-06-23",
			description: "UK votes to leave EU",
		},
	];

	const mockUkClimateEventsData = [
		{
			_id: "event1",
			title: "IPCC established",
			date: "1988-11-01",
			description:
				"Intergovernmental Panel on Climate Change formed to assess scientific evidence on climate change",
		},
		{
			_id: "event2",
			title: "Stabilise Greenhouse Gas",
			date: "1992-06-13",
			description:
				"World leaders agree to stabilise greenhouse gas concentrations; foundation for later climate treaties",
		},
	];

	const mockUsClimateEventsData = [
		{
			_id: "event9",
			title: "Sample-US",
			date: "1988-11-01",
			description: "XYZ",
		},
		{
			_id: "event10",
			title: "Sample-US-2",
			date: "1992-06-13",
			description: "YZX",
		},
	];

	const mockTimelinesData = [
		{
			title: "Brexit Campaign",
			description: "Timeline of Brexit events",
			events: [],
		},
		{
			title: "COVID-19 Pandemic",
			description: "Timeline of COVID-19 events",
			events: [],
		},
		{
			title: "UK Response to Climate Change",
			description: "Timeline of UK Response to Climate Change",
			events: [],
		},
		{
			title: "US Response to Climate Change",
			description: "Timeline of US Response to Climate Change",
			events: [],
		},
	];

	const mockCreatedBrexitEvents = [
		{ ...mockBrexitEventsData[0], _id: "createdEvent1" },
		{ ...mockBrexitEventsData[1], _id: "createdEvent2" },
	];

	const mockCreatedCovidEvents = [
		{ ...mockCovidEventsData[0], _id: "createdEvent3" },
		{ ...mockCovidEventsData[1], _id: "createdEvent4" },
	];

	const mockCreatedUkClimateEvents = [
		{ ...mockUkClimateEventsData[0], _id: "createdEvent5" },
		{ ...mockUkClimateEventsData[1], _id: "createdEvent6" },
	];

	const mockCreatedUsClimateEvents = [
		{ ...mockUsClimateEventsData[0], _id: "createdEvent7" },
		{ ...mockUsClimateEventsData[1], _id: "createdEvent8" },
	];

	beforeEach(async () => {
		vi.clearAllMocks();

		vi.spyOn(console, "log").mockImplementation(() => {});

		vi.mocked(dbConnect).mockResolvedValue({} as Awaited<ReturnType<typeof dbConnect>>);
		vi.mocked(Event.deleteMany).mockResolvedValue({ deletedCount: 0, acknowledged: true });
		vi.mocked(Timeline.deleteMany).mockResolvedValue({ deletedCount: 0, acknowledged: true });

		vi.mocked(Event.insertMany)
			.mockResolvedValueOnce(mockCreatedBrexitEvents) // first call for Brexit
			.mockResolvedValueOnce(mockCreatedCovidEvents) // second call for COVID
			.mockResolvedValueOnce(mockCreatedUkClimateEvents) // third call for UK Climate Response
			.mockResolvedValueOnce(mockCreatedUsClimateEvents); // fourth call for US Climate Response

		vi.mocked(Timeline.insertMany).mockResolvedValue([]);

		vi.mocked(path.join).mockImplementation((...args) => args.join("/"));
		vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown): string => {
			if (typeof filePath !== "string") return "";
			if (filePath.includes("sample-events.json")) {
				return JSON.stringify(mockBrexitEventsData);
			}
			if (filePath.includes("sample-covid-data.json")) {
				return JSON.stringify(mockCovidEventsData);
			}
			if (filePath.includes("sample-uk-climate-data.json")) {
				return JSON.stringify(mockUkClimateEventsData);
			}
			if (filePath.includes("sample-us-climate-data.json")) {
				return JSON.stringify(mockUsClimateEventsData);
			}
			if (filePath.includes("sample-timelines.json")) {
				return JSON.stringify(mockTimelinesData);
			}

			return JSON.stringify([]);
		});

		vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
			console.log(`process.exit called with code ${code}`);
			return undefined as never;
		}) as unknown as typeof process.exit);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should utilise the existing dbConnect to connect to MongoDB", async () => {
		await populateData();
		expect(dbConnect).toHaveBeenCalledOnce();
	});

	it("should clear existing collections before populating", async () => {
		await populateData();

		expect(Event.deleteMany).toHaveBeenCalledWith({});
		expect(Timeline.deleteMany).toHaveBeenCalledWith({});
	});

	it("should load JSON files from correct paths", async () => {
		await populateData();

		expect(path.join).toHaveBeenCalledWith(process.cwd(), "src/app/data/sample-events.json");
		expect(path.join).toHaveBeenCalledWith(process.cwd(), "src/app/data/sample-timelines.json");
		expect(path.join).toHaveBeenCalledWith(
			process.cwd(),
			"src/app/data/sample-covid-data.json"
		);
		expect(path.join).toHaveBeenCalledWith(
			process.cwd(),
			"src/app/data/sample-uk-climate-data.json"
		);
		expect(path.join).toHaveBeenCalledWith(
			process.cwd(),
			"src/app/data/sample-us-climate-data.json"
		);
		expect(fs.readFileSync).toHaveBeenCalledTimes(5);
	});

	it("should insert events into database", async () => {
		await populateData();

		expect(Event.insertMany).toHaveBeenCalledWith(mockBrexitEventsData);
		expect(Event.insertMany).toHaveBeenCalledWith(mockCovidEventsData);
		expect(Event.insertMany).toHaveBeenCalledWith(mockUkClimateEventsData);
		expect(Event.insertMany).toHaveBeenCalledWith(mockUsClimateEventsData);
	});

	it("should link events to Brexit timeline", async () => {
		await populateData();

		expect(Timeline.insertMany).toHaveBeenCalled();
		const insertedTimelines = vi.mocked(Timeline.insertMany).mock
			.calls[0][0] as typeof mockTimelinesData;
		const brexitTimeline = insertedTimelines.find((t) => t.title === "Brexit Campaign");

		expect(brexitTimeline).toBeDefined();
		expect(brexitTimeline?.events).toBeDefined();
		expect(brexitTimeline?.events).toEqual(["createdEvent1", "createdEvent2"]);
	});

	it("should link events to Covid timeline", async () => {
		await populateData();

		expect(Timeline.insertMany).toHaveBeenCalled();
		const insertedTimelines = vi.mocked(Timeline.insertMany).mock
			.calls[0][0] as typeof mockTimelinesData;
		const covidTimeline = insertedTimelines.find((t) => t.title === "COVID-19 Pandemic");

		expect(covidTimeline).toBeDefined();
		expect(covidTimeline?.events).toBeDefined();
		expect(covidTimeline?.events).toEqual(["createdEvent3", "createdEvent4"]);
	});

	it("should link events to UK Climate Response timeline", async () => {
		await populateData();

		expect(Timeline.insertMany).toHaveBeenCalled();
		const insertedTimelines = vi.mocked(Timeline.insertMany).mock
			.calls[0][0] as typeof mockTimelinesData;
		const ukClimateResponseTimeline = insertedTimelines.find(
			(t) => t.title === "UK Response to Climate Change"
		);

		expect(ukClimateResponseTimeline).toBeDefined();
		expect(ukClimateResponseTimeline?.events).toBeDefined();
		expect(ukClimateResponseTimeline?.events).toEqual(["createdEvent5", "createdEvent6"]);
	});

	it("Brexit events not modify Covid timelines", async () => {
		await populateData();

		const insertedTimelines = vi.mocked(Timeline.insertMany).mock
			.calls[0][0] as typeof mockTimelinesData;
		const covidTimeline = insertedTimelines.find((t) => t.title === "COVID-19 Pandemic");

		expect(covidTimeline).toBeDefined();
		expect(covidTimeline?.events).toBeDefined();
		expect(covidTimeline?.events).toEqual(["createdEvent3", "createdEvent4"]);
	});

	it("should call for insertion of timelines into database", async () => {
		await populateData();
		expect(Timeline.insertMany).toHaveBeenCalledOnce();
	});

	it("should log completion message and exit with code 0", async () => {
		await populateData();

		expect(console.log).toHaveBeenCalledWith("MongoDB data population script completed!");
		expect(process.exit).toHaveBeenCalledWith(0);
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
		vi.mocked(fs.readFileSync).mockReturnValue("invalid json{");

		await populateData();

		expect(console.log).toHaveBeenCalledWith(
			expect.stringContaining(
				"An error occurred whilst attempting to populate the database: "
			),
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
		vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown): string => {
			if (typeof filePath !== "string") return "";
			if (filePath.includes("sample-events.json")) {
				return JSON.stringify([]);
			}
			if (filePath.includes("sample-covid-data.json")) {
				return JSON.stringify(mockCovidEventsData);
			}
			if (filePath.includes("sample-uk-climate-data.json")) {
				return JSON.stringify(mockUkClimateEventsData);
			}
			if (filePath.includes("sample-timelines.json")) {
				return JSON.stringify(mockTimelinesData);
			}
			return "[]";
		});
		vi.mocked(Event.insertMany).mockResolvedValue([]);

		await populateData();

		expect(Event.insertMany).toHaveBeenCalledWith([]);
		expect(Event.insertMany).toHaveBeenCalledWith(mockCovidEventsData);
	});

	it("should handle empty Covid events array", async () => {
		vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown): string => {
			if (typeof filePath !== "string") return "";
			if (filePath.includes("sample-events.json")) {
				return JSON.stringify(mockBrexitEventsData);
			}
			if (filePath.includes("sample-covid-data.json")) {
				return JSON.stringify([]);
			}
			if (filePath.includes("sample-uk-climate-data.json")) {
				return JSON.stringify(mockUkClimateEventsData);
			}
			if (filePath.includes("sample-timelines.json")) {
				return JSON.stringify(mockTimelinesData);
			}
			return "[]";
		});
		vi.mocked(Event.insertMany).mockResolvedValue([]);

		await populateData();

		expect(Event.insertMany).toHaveBeenCalledWith(mockBrexitEventsData);
		expect(Event.insertMany).toHaveBeenCalledWith([]);
		expect(Event.insertMany).toHaveBeenCalledWith(mockUkClimateEventsData);
	});

	it("should handle empty UK Climate events array", async () => {
		vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown): string => {
			if (typeof filePath !== "string") return "";
			if (filePath.includes("sample-events.json")) {
				return JSON.stringify(mockBrexitEventsData);
			}
			if (filePath.includes("sample-covid-data.json")) {
				return JSON.stringify(mockCovidEventsData);
			}
			if (filePath.includes("sample-uk-climate-data.json")) {
				return JSON.stringify([]);
			}
			if (filePath.includes("sample-timelines.json")) {
				return JSON.stringify(mockTimelinesData);
			}
			return "[]";
		});
		vi.mocked(Event.insertMany).mockResolvedValue([]);

		await populateData();

		expect(Event.insertMany).toHaveBeenCalledWith(mockBrexitEventsData);
		expect(Event.insertMany).toHaveBeenCalledWith(mockCovidEventsData);
		expect(Event.insertMany).toHaveBeenCalledWith([]);
	});

	it("should handle empty Covid, Brexit and UK Climate events array", async () => {
		vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown): string => {
			if (typeof filePath !== "string") return "";
			if (filePath.includes("sample-events.json")) {
				return JSON.stringify([]);
			}
			if (filePath.includes("sample-covid-data.json")) {
				return JSON.stringify([]);
			}
			if (filePath.includes("sample-uk-climate-data.json")) {
				return JSON.stringify([]);
			}
			if (filePath.includes("sample-timelines.json")) {
				return JSON.stringify(mockTimelinesData);
			}
			return "[]";
		});
		vi.mocked(Event.insertMany).mockResolvedValue([]);

		await populateData();

		expect(Event.insertMany).toHaveBeenCalledWith([]);
		expect(Event.insertMany).toHaveBeenCalledWith([]);
		expect(Event.insertMany).toHaveBeenCalledWith([]);
	});

	it("should handle empty timelines array", async () => {
		vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown): string => {
			if (typeof filePath !== "string") return "";
			if (filePath.includes("sample-events.json")) {
				return JSON.stringify(mockBrexitEventsData);
			}
			if (filePath.includes("sample-covid-data.json")) {
				return JSON.stringify(mockCovidEventsData);
			}
			if (filePath.includes("sample-uk-climate-data.json")) {
				return JSON.stringify(mockUkClimateEventsData);
			}
			if (filePath.includes("sample-timelines.json")) {
				return JSON.stringify([]);
			}
			return "[]";
		});

		await populateData();

		expect(Timeline.insertMany).toHaveBeenCalledWith([]);
	});

	it("should handle missing Brexit timeline gracefully", async () => {
		const timelinesWithoutBrexit = [
			{
				title: "Other Timeline",
				description: "Another timeline",
				events: [],
			},
		];

		vi.mocked(fs.readFileSync).mockImplementation((filePath: unknown): string => {
			if (typeof filePath !== "string") return "";
			if (filePath.includes("sample-events.json")) {
				return JSON.stringify(mockBrexitEventsData);
			}
			if (filePath.includes("sample-covid-data.json")) {
				return JSON.stringify(mockCovidEventsData);
			}
			if (filePath.includes("sample-uk-climate-data.json")) {
				return JSON.stringify(mockUkClimateEventsData);
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

	it("Correctly links US and UK Climate Response timelines for comparison", async () => {
		const mockUkTimeline = { _id: "uk123", title: "UK Response to Climate Change" };
		const mockUsTimeline = { _id: "us456", title: "US Response to Climate Change" };

		vi.mocked(Timeline.findOne)
			.mockResolvedValueOnce(mockUkTimeline) // first call for UK
			.mockResolvedValueOnce(mockUsTimeline); // second call for US

		vi.mocked(Timeline.updateOne).mockResolvedValue({
			acknowledged: true,
			matchedCount: 1,
			modifiedCount: 1,
			upsertedCount: 0,
			upsertedId: null,
		});

		await populateData();

		// Assert correct update calls made for each timeline for comparableTimelines array
		expect(Timeline.updateOne).toHaveBeenCalledWith(
			{ _id: "uk123" },
			{ $addToSet: { comparableTimelines: "us456" } }
		);

		expect(Timeline.updateOne).toHaveBeenCalledWith(
			{ _id: "us456" },
			{ $addToSet: { comparableTimelines: "uk123" } }
		);
	});
});
