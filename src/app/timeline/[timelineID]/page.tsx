"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";

import CompareTimelines from "@/app/components/CompareTimelines";
import ContinuousScaleTimeline from "@/app/components/ContinuousScaleTimeline";
import HorizontalTimeline from "@/app/components/HorizontalTimeline";
import TimelineFilters from "@/app/components/ui/TimelineFilters";
import VerticalTimeline from "@/app/components/VerticalTimeline";
import { useTimelineComparisonData } from "@/app/hooks/useTimelineComparisonData";
import { getEventsInTimeline } from "@/app/lib/api/getEventsInTimeline";
import { getTimelineFromId } from "@/app/lib/api/getTimelineFromId";
import { filterEvents } from "@/app/lib/filterEvents";
import { EventData, EventFiltersState } from "@/app/models/event";
import { TimelineData } from "@/app/models/timeline";

export default function TimelinePage() {
	const { timelineID } = useParams<{
		timelineID: string;
	}>();

	const [events, setEvents] = useState<EventData[]>([]);
	const [eventFilters, setEventFilters] = useState<EventFiltersState>({ tags: [] });

	const [timelineConfig, setTimelineConfig] = useState({
		name: "",
		shortName: "",
		isMultipleSided: false,
		isContinuousScale: false,
		comparableTimelines: [] as string[],
		leftLabel: "",
		rightLabel: "",
	});

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [verticalSelected, setVerticalSelected] = useState(false);
	const [selectedComparableTimelineID, setSelectedComparableTimelineID] = useState<string | null>(
		null
	);

	const {
		compareData: compareEventsData,
		compareTimelineShortName: compareTimelineShortName,
		loading: compareLoading,
		error: compareError,
	} = useTimelineComparisonData(timelineID, selectedComparableTimelineID);

	useEffect(() => {
		const fetchEventAndTimelineData = async () => {
			try {
				const eventsData = await getEventsInTimeline({ timelineID });
				setEvents(eventsData);

				const timelineData: TimelineData[] = await getTimelineFromId({ timelineID });

				setTimelineConfig({
					name: timelineData[0].title,
					shortName: timelineData[0].shortName ?? "",
					isContinuousScale: !!timelineData[0].continuousScale,
					isMultipleSided: !!timelineData[0].multipleView,
					comparableTimelines: timelineData[0].comparableTimelines ?? [],
					leftLabel: timelineData[0].leftLabel ?? "",
					rightLabel: timelineData[0].rightLabel ?? "",
				});
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error whilst fetching data");
			} finally {
				setLoading(false);
			}
		};

		fetchEventAndTimelineData();
	}, [timelineID]);

	const filteredEvents = useMemo(() => {
		return filterEvents({ events: events, filters: eventFilters });
	}, [events, eventFilters]);

	const filteredCompareEvents = useMemo(() => {
		if (!compareEventsData) return null;

		return filterEvents({
			events: compareEventsData,
			filters: eventFilters,
		});
	}, [compareEventsData, eventFilters]);

	const handleEventFilterChange = useCallback((newEventFilters: EventFiltersState) => {
		setEventFilters(newEventFilters);
	}, []);

	if (loading || compareLoading) {
		return (
			// Loading spinner animation
			<div className="flex justify-center items-center py-4">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
			</div>
		);
	}

	if (error) return <p>Error fetching events: {error}</p>;
	if (compareError) return <p>Error whilst fetching comparison events: {compareError}</p>;

	const handleCompareTimelineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedId = e.target.value;
		setSelectedComparableTimelineID(selectedId === "" ? null : selectedId);
	};

	const displayTimeline = () => {
		if (selectedComparableTimelineID && filteredCompareEvents) {
			return (
				<CompareTimelines
					events={filteredCompareEvents} // Todo: handle filtered events in comparison data
					leftLabel={timelineConfig.leftLabel}
					rightLabel={timelineConfig.rightLabel}
					timelineOneLabel={compareTimelineShortName}
					timelineTwoLabel={timelineConfig.shortName}
				/>
			);
		}

		if (timelineConfig.isMultipleSided) {
			return (
				<VerticalTimeline
					events={filteredEvents}
					isTwoSided={true}
					leftLabel={timelineConfig.leftLabel}
					rightLabel={timelineConfig.rightLabel}
				/>
			);
		}

		if (timelineConfig.isContinuousScale) {
			return (
				<ContinuousScaleTimeline
					events={filteredEvents}
					leftLabel={timelineConfig.leftLabel}
					rightLabel={timelineConfig.rightLabel}
				/>
			);
		}

		// If not multiple sided: use toggle between vertical and horizontal
		return verticalSelected ? (
			<VerticalTimeline
				events={filteredEvents}
				isTwoSided={false}
				leftLabel={timelineConfig.leftLabel}
				rightLabel={timelineConfig.rightLabel}
			/>
		) : (
			<HorizontalTimeline events={filteredEvents} />
		);
	};

	return (
		<div>
			{/* Timeline title header */}
			<div className="flex justify-center items-center w-full mb-5 md:mb-8">
				<h1 className="text-3xl">
					{" "}
					<span className="font-bold text-blue-500">{timelineConfig.name}</span> Event
					Timeline
				</h1>
			</div>

			{/* Event filter options */}
			<div className="flex justify-between items-center mb-5 md:mb-10 max-w-full lg:max-w-5/6 ml-auto mr-auto">
				<TimelineFilters eventsArray={events} onFiltersChange={handleEventFilterChange} />

				{/* Display toggle (horizontal/ vertical) if not a two-sided timeline */}
				{!timelineConfig.isMultipleSided && !timelineConfig.isContinuousScale && (
					<div className="flex flex-col">
						<label className="block mb-2 text-xs md:text-sm">Display Mode:</label>

						<div>
							<div className="inline-flex items-center gap-2">
								<label
									htmlFor="switch-component-on"
									className="text-sm cursor-pointer"
								>
									Horizontal
								</label>

								<div className="relative inline-block w-11 h-5">
									<input
										id="switch-component-on"
										type="checkbox"
										className="peer appearance-none w-11 h-5 bg-slate-100 dark:bg-slate-600 rounded-full checked:bg-blue-600 cursor-pointer transition-colors duration-300"
										checked={verticalSelected}
										onChange={(e) => setVerticalSelected(e.target.checked)}
									/>
									<label
										htmlFor="switch-component-on"
										className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 dark:border-slate-600 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-slate-800 cursor-pointer"
									></label>
								</div>

								<label
									htmlFor="switch-component-on"
									className="text-sm cursor-pointer"
								>
									Vertical
								</label>
							</div>
						</div>
					</div>
				)}

				{timelineConfig.comparableTimelines.length > 0 && (
					<div>
						<label className="block mb-2 text-xs md:text-sm">
							Compare with other Timeline:
						</label>
						<select
							className="text-xs md:text-sm rounded-lg dark:bg-gray-700 focus:ring-blue-500 dark:hover:bg-gray-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
							onChange={handleCompareTimelineChange}
							value={selectedComparableTimelineID || ""}
						>
							<option value="" className="dark:bg-gray-700 darK:text-white">
								Do Not Compare
							</option>
							{timelineConfig.comparableTimelines.map((timeline, index) => (
								<option key={index} value={timeline}>
									{timeline}
								</option>
							))}
						</select>
					</div>
				)}
			</div>

			{events.length === 0 ? (
				<p>No events found for this timeline.</p>
			) : (
				<section className="w-full max-w-screen-xl mx-auto">
					<div className="overflow-x-auto">{displayTimeline()}</div>
				</section>
			)}
		</div>
	);
}
