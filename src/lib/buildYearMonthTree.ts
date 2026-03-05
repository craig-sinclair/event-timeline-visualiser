import { YearEntry } from "@/models/dateFilters.types";
import { EventData } from "@/models/event";
import { MONTH_NAMES } from "@/utils/month-names.const";

export function buildYearMonthTree(eventsArray: EventData[]): YearEntry[] {
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
