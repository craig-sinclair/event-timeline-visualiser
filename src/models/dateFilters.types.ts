import { EventData } from "@/models/event";

export interface DateRangeFilterProps {
	eventsArray: EventData[];
	onChange: (range: { start: Date | null; end: Date | null }) => void;
}

export interface MonthEntry {
	value: string;
	label: string;
	start: Date;
	end: Date;
}

export interface YearEntry {
	year: string;
	start: Date;
	end: Date;
	months: MonthEntry[];
}
