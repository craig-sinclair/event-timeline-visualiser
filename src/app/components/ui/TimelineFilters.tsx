"use client";
import { useState, useEffect } from "react";
import Select from "react-select";

import { getAllTagsInTimeline } from "@/app/lib/getAllTagsInTimeline";
import { EventData, ReactSelectEvent } from "@/app/models/event";

export default function TimelineFilters({ eventsArray }: { eventsArray: EventData[] }) {
	// const [ selectedTags, setSelectedTags ] = useState<string[]>([]);
	const [allTags, setAllTags] = useState<ReactSelectEvent[]>([]);

	// React select component expects list of dictionary of value/label key/values for options
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

	return (
		<>
			<div>
				<label className="block mb-2 text-xs md:text-sm">Date Range</label>
				<input
					type="text"
					className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
					placeholder="All Time"
				/>
			</div>

			<div>
				<label className="block mb-2 text-xs md:text-sm">Tags</label>
				{/* <input
					type="text"
					className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
					placeholder="View All"
				/> */}
				<Select
					options={allTags}
					isMulti
					name="tags"
					className="basic-multi-select"
					classNamePrefix="select"
				/>
			</div>

			<div>
				<label className="block mb-2 text-xs md:text-sm">Min. Relevance</label>
				<input
					type="text"
					className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
					placeholder="High"
				/>
			</div>

			<div>
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
