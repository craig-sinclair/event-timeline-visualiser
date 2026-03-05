"use client";
import { useState, useEffect } from "react";
import Select from "react-select";

import { DateRangeFilter } from "@/components/ui/DateRangeFilter";
import { customStyles } from "@/components/ui/TimelineFilters.styles";
import { EventData, EventFiltersState, ReactSelectEvent, EventSortByOptions } from "@/models/event";
import { TopicReference } from "@/models/ontology.types";

export default function TimelineFilters({
	eventsArray,
	onFiltersChange,
	onSortByChange,
	allMediaTopics,
}: {
	eventsArray: EventData[];
	onFiltersChange: (filters: EventFiltersState) => void;
	onSortByChange: (sortBy: EventSortByOptions) => void;
	allMediaTopics: TopicReference[];
}) {
	const [selectedMediaTopics, setSelectedMediaTopics] = useState<ReactSelectEvent[]>([]);
	const [minimumRelevance, setMinimumRelevance] = useState<number>(0.0);
	const [selectedSortBy, setSelectedSortBy] = useState<EventSortByOptions>("date-asc");

	const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
		start: null,
		end: null,
	});

	const createReactSelectFormatEvents = (allTopics: TopicReference[]) => {
		const completeDictionary = [];
		for (const topic of allTopics) {
			completeDictionary.push({
				value: topic.qcode,
				label: topic.prefLabel,
			});
		}
		return completeDictionary;
	};

	const allFormattedMediaTopics = createReactSelectFormatEvents(allMediaTopics);

	// When filter useState variables change, notify parent timeline component
	useEffect(() => {
		onFiltersChange({
			qcode: selectedMediaTopics.map((topic) => topic.value),
			minRelevance: minimumRelevance,
			dateRange: dateRange,
		});
	}, [selectedMediaTopics, minimumRelevance, dateRange, onFiltersChange]);

	// When sort by option changes, notify the parent timeline component
	useEffect(() => {
		onSortByChange(selectedSortBy);
	}, [selectedSortBy, onSortByChange]);

	return (
		<div className="flex flex-col gap-4 w-full">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
				<DateRangeFilter
					eventsArray={eventsArray}
					onChange={({ start, end }) => {
						setDateRange({ start, end });
					}}
				/>

				<div className="flex flex-col gap-2 w-full">
					<label className="block text-xs md:text-sm font-medium">Media Topics</label>
					<Select
						options={allFormattedMediaTopics}
						value={selectedMediaTopics}
						onChange={(selected) =>
							setSelectedMediaTopics(selected as ReactSelectEvent[])
						}
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

				<div className="flex flex-col gap-2 w-full">
					<label className="text-xs md:text-sm font-medium">Min. Relevance</label>
					<div className="flex items-center h-[42px]">
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
				</div>

				<div className="flex flex-col gap-2 w-full">
					<label className="text-xs md:text-sm font-medium text-[var(--foreground)]">
						Sort By
					</label>
					<select
						value={selectedSortBy}
						onChange={(e) => setSelectedSortBy(e.target.value as EventSortByOptions)}
						className="w-full px-3 py-2.5 text-xs md:text-sm rounded-lg cursor-pointer appearance-none bg-[var(--background)] border border-[var(--borderColour)] hover:border-[var(--borderColour)] focus:outline-none"
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
			</div>
		</div>
	);
}
