"use client";

import { useEffect, useState } from "react";

import { EventData } from "@/models/event";

interface DateRangeFilterProps {
	eventsArray: EventData[];
	onChange: (range: { start: Date | null; end: Date | null }) => void;
}

interface MonthEntry {
	value: string;
	label: string;
	start: Date;
	end: Date;
}

interface YearEntry {
	year: string;
	start: Date;
	end: Date;
	months: MonthEntry[];
}

const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

function buildYearMonthTree(eventsArray: EventData[]): YearEntry[] {
	if (!eventsArray.length) return [];

	// Collect unique year-month combos
	const tree: Record<string, Set<number>> = {};
	for (const event of eventsArray) {
		const year = event.dateTime.substring(0, 4);
		const month = parseInt(event.dateTime.substring(5, 7), 10) - 1;
		if (!tree[year]) tree[year] = new Set();
		if (!isNaN(month)) tree[year].add(month);
	}

	return Object.keys(tree)
		.sort()
		.map((year) => {
			const months = Array.from(tree[year]).sort((a, b) => a - b);
			return {
				year,
				start: new Date(Number(year), 0, 1),
				end: new Date(Number(year), 11, 31, 23, 59, 59),
				months: months.map((m) => ({
					value: `${year}-${String(m + 1).padStart(2, "0")}`,
					label: MONTH_NAMES[m],
					start: new Date(Number(year), m, 1),
					end: new Date(Number(year), m + 1, 0, 23, 59, 59),
				})),
			};
		});
}

export function DateRangeFilter({ eventsArray, onChange }: DateRangeFilterProps) {
	const [tree, setTree] = useState<YearEntry[]>([]);
	const [selected, setSelected] = useState<string>("");

	useEffect(() => {
		setTree(buildYearMonthTree(eventsArray));
		setSelected("");
	}, [eventsArray]);

	useEffect(() => {
		if (!selected) {
			onChange({ start: null, end: null });
			return;
		}

		if (selected.includes("-")) {
			const [y, m] = selected.split("-").map(Number);
			onChange({
				start: new Date(y, m - 1, 1),
				end: new Date(y, m, 0, 23, 59, 59),
			});
			return;
		}

		const entry = tree.find((t) => t.year === selected);
		if (entry) onChange({ start: entry.start, end: entry.end });
	}, [selected, tree]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className="flex flex-col gap-2 w-full">
			<label className="text-xs md:text-sm font-medium text-[var(--foreground)]">
				Date Range
			</label>

			<select
				value={selected}
				onChange={(e) => setSelected(e.target.value)}
				className="w-full px-3 py-2.5 text-xs md:text-sm rounded-lg cursor-pointer appearance-none bg-[var(--background)] border border-[var(--borderColour)] focus:outline-none"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
					backgroundRepeat: "no-repeat",
					backgroundPosition: "right 0.75rem center",
					backgroundSize: "12px",
					paddingRight: "2.5rem",
				}}
			>
				<option value="">All Time</option>
				{tree.map(({ year, months }) =>
					months.length <= 1 ? (
						<option key={year} value={year}>
							{year}
						</option>
					) : (
						<optgroup key={year} label={year}>
							<option value={year}>All of {year}</option>
							{months.map((m) => (
								<option key={m.value} value={m.value}>
									{m.label}
								</option>
							))}
						</optgroup>
					)
				)}
			</select>
		</div>
	);
}
