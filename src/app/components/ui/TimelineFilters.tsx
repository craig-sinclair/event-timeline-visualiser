"use client";
import { useState, useEffect } from "react";
import Select from "react-select";

import { customStyles } from "@/app/components/ui/TimelineFilters.styles";
import { getAllTagsInTimeline } from "@/app/lib/getAllTagsInTimeline";
import {
	EventData,
	EventFiltersState,
	ReactSelectEvent,
	EventSortByOptions,
} from "@/app/models/event";

export default function TimelineFilters({
	eventsArray,
	onFiltersChange,
	onSortByChange,
}: {
	eventsArray: EventData[];
	onFiltersChange: (filters: EventFiltersState) => void;
	onSortByChange: (sortBy: EventSortByOptions) => void;
}) {
	const [selectedTags, setSelectedTags] = useState<ReactSelectEvent[]>([]);
	const [allTags, setAllTags] = useState<ReactSelectEvent[]>([]);

	const [minimumRelevance, setMinimumRelevance] = useState<number>(0.0);
	const [selectedSortBy, setSelectedSortBy] = useState<EventSortByOptions>("date-asc");
	const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");

	const createReactSelectFormatEvents = (allAvailable: string[]) => {
		const completeDictionary = [];
		for (const tag of allAvailable) {
			completeDictionary.push({
				value: tag,
				label: tag,
			});
		}
		return completeDictionary;
	};

	// Fetch all the tags in the given timeline
	useEffect(() => {
		const fetchAllTags = () => {
			const allTags = getAllTagsInTimeline({ eventsArray: eventsArray });
			setAllTags(createReactSelectFormatEvents(allTags));
		};
		fetchAllTags();
	}, [eventsArray]);

	// When filter useState variables change, notify parent timeline component
	useEffect(() => {
		onFiltersChange({
			tags: selectedTags.map((tag) => tag.value),
			minRelevance: minimumRelevance,
			dateRange: selectedDateFilter,
		});
	}, [selectedTags, minimumRelevance, selectedDateFilter, onFiltersChange]);

	// When sort by option changes, notify the parent timeline component
	useEffect(() => {
		onSortByChange(selectedSortBy);
	}, [selectedSortBy, onSortByChange]);

	return (
		<>
			<div className="flex flex-col gap-2">
				<label className="text-xs md:text-sm font-medium text-[var(--foreground)]">
					Date Range
				</label>
				<select
					value={selectedDateFilter}
					onChange={(e) => setSelectedDateFilter(e.target.value as string)}
					className="w-full px-3 py-2.5 text-xs md:text-sm rounded-lg cursor-pointer appearance-none bg-[var(--background)] border border-[var(--borderColour)] hover:border-[var(--borderColour)] focus:outline-none focus:ring-0 focus:border-[var(--borderColour)] transition-colors"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
						backgroundRepeat: "no-repeat",
						backgroundPosition: "right 0.75rem center",
						backgroundSize: "12px",
						paddingRight: "2.5rem",
					}}
				>
					<option value="">All Time</option>
					<option value="1980">1980</option>
					<option value="2016">2016</option>
					<option value="2025">2025</option>
				</select>
			</div>

			<div className="w-xs">
				<label className="block mb-2 text-xs md:text-sm">Tags</label>
				<Select
					options={allTags}
					value={selectedTags}
					onChange={(selected) => setSelectedTags(selected as ReactSelectEvent[])}
					isMulti
					name="tags"
					className="text-xs md:text-sm"
					classNamePrefix="select"
					styles={customStyles}
					placeholder="View All"
					closeMenuOnSelect={false}
					hideSelectedOptions={false}
				/>
			</div>

			<div className="w-xs">
				<label className="block mb-2 text-xs md:text-sm">Min. Relevance</label>
				<input
					type="range"
					min={0}
					max={1}
					value={minimumRelevance}
					step={0.1}
					onChange={(e) => setMinimumRelevance(Number(e.target.value))}
					className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[var(--lightSecondary)] dark:bg-[var(--darkSecondary)] accent-blue-500 border border-[var(--borderColour)]"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label className="text-xs md:text-sm font-medium text-[var(--foreground)]">
					Sort By
				</label>
				<select
					value={selectedSortBy}
					onChange={(e) => setSelectedSortBy(e.target.value as EventSortByOptions)}
					className="w-full px-3 py-2.5 text-xs md:text-sm rounded-lg cursor-pointer appearance-none bg-[var(--background)] border border-[var(--borderColour)] hover:border-[var(--borderColour)] focus:outline-none focus:ring-0 focus:border-[var(--borderColour)] transition-colors"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
						backgroundRepeat: "no-repeat",
						backgroundPosition: "right 0.75rem center",
						backgroundSize: "12px",
						paddingRight: "2.5rem",
					}}
				>
					<option value="date-asc">Chronological</option>
					<option value="relevance-asc">Relevance (Low to High)</option>
					<option value="relevance-desc">Relevance (High to Low)</option>
					<option value="date-desc">Newest</option>
				</select>
			</div>
		</>
	);
}
