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

	useEffect(() => {
		const fetchAllTags = () => {
			const allTags = getAllTagsInTimeline({ eventsArray: eventsArray });
			setAllTags(createReactSelectFormatEvents(allTags));
		};
		fetchAllTags();
	}, [eventsArray]);

	// When tags change, notify parent timeline component
	useEffect(() => {
		onFiltersChange({
			tags: selectedTags.map((tag) => tag.value),
		});
	}, [selectedTags, onFiltersChange]);

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
					type="text"
					className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
					placeholder="High"
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
