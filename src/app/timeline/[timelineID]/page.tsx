"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";

import ContinuousScaleTimeline from "@/components/ContinuousScaleTimeline";
import HorizontalTimeline from "@/components/HorizontalTimeline";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TimelineFilters from "@/components/ui/TimelineFilters";
import VerticalTimeline from "@/components/VerticalTimeline";
import { getEventsInTimeline } from "@/lib/api/getEventsInTimeline";
import { getTimelineFromId } from "@/lib/api/getTimelineFromId";
import { filterEvents } from "@/lib/filterEvents";
import { sortEvents } from "@/lib/sortEvents";
import { EventData, EventFiltersState, EventSortByOptions } from "@/models/event";
import { TimelineData } from "@/models/timeline";

export default function TimelinePage() {
	const { timelineID } = useParams<{
		timelineID: string;
	}>();

	const [events, setEvents] = useState<EventData[]>([]);
	const [eventFilters, setEventFilters] = useState<EventFiltersState>({ tags: [] });
	const [eventSortBy, setEventSortBy] = useState<EventSortByOptions>("date-asc");

	const [timelineConfig, setTimelineConfig] = useState({
		name: "",
		shortName: "",
		isMultipleSided: false,
		isContinuousScale: false,
		leftLabel: "",
		rightLabel: "",
	});

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [verticalSelected, setVerticalSelected] = useState(false);

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

	const filteredAndSortedEvents = useMemo(() => {
		const filteredEvents = filterEvents({ events: events, filters: eventFilters });
		return sortEvents({ events: filteredEvents, sortBy: eventSortBy });
	}, [events, eventFilters, eventSortBy]);

	const handleEventFilterChange = useCallback((newEventFilters: EventFiltersState) => {
		setEventFilters(newEventFilters);
	}, []);

	const handleEventSortByChange = useCallback((newEventSortBy: EventSortByOptions) => {
		setEventSortBy(newEventSortBy);
	}, []);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error) return <p>Error fetching events: {error}</p>;

	const displayTimeline = () => {
		if (timelineConfig.isMultipleSided) {
			return (
				<VerticalTimeline
					events={filteredAndSortedEvents}
					isTwoSided={true}
					leftLabel={timelineConfig.leftLabel}
					rightLabel={timelineConfig.rightLabel}
				/>
			);
		}

		if (timelineConfig.isContinuousScale) {
			return (
				<ContinuousScaleTimeline
					events={filteredAndSortedEvents}
					leftLabel={timelineConfig.leftLabel}
					rightLabel={timelineConfig.rightLabel}
				/>
			);
		}

		// If not multiple sided: use toggle between vertical and horizontal
		return verticalSelected ? (
			<VerticalTimeline
				events={filteredAndSortedEvents}
				isTwoSided={false}
				leftLabel={timelineConfig.leftLabel}
				rightLabel={timelineConfig.rightLabel}
			/>
		) : (
			<HorizontalTimeline events={filteredAndSortedEvents} />
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
				<TimelineFilters
					eventsArray={events}
					onFiltersChange={handleEventFilterChange}
					onSortByChange={handleEventSortByChange}
				/>

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
