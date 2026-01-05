"use client";
import { useState, useEffect } from "react";
import Select from "react-select";

import { customStyles } from "@/app/components/ui/TimelineFilters.styles";
import { getAllTagsInTimeline } from "@/app/lib/getAllTagsInTimeline";
import { EventData, EventFiltersState, ReactSelectEvent } from "@/app/models/event";

export default function TimelineFilters({
	eventsArray,
	onFiltersChange,
}: {
	eventsArray: EventData[];
	onFiltersChange: (filters: EventFiltersState) => void;
}) {
	const [selectedTags, setSelectedTags] = useState<ReactSelectEvent[]>([]);
	const [allTags, setAllTags] = useState<ReactSelectEvent[]>([]);
	const [minimumRelevance, setMinimumRelevance] = useState<number>(0.0);

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
		});
	}, [selectedTags, minimumRelevance, onFiltersChange]);

	return (
		<>
			<div className="w-xs">
				<label className="block mb-2 text-xs md:text-sm">Date Range</label>
				<input
					type="text"
					className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
					placeholder="All Time"
				/>
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

			<div className="w-xs">
				<label className="block mb-2 text-xs md:text-sm">Sort By</label>
				<input
					type="text"
					className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
					placeholder="Chronological"
				/>
			</div>
		</>
	);
}
