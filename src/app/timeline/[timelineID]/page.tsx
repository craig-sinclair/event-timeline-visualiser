"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import CompareTimelines from "@/app/components/CompareTimelines";
import ContinuousScaleTimeline from "@/app/components/ContinuousScaleTimeline";
import HorizontalTimeline from "@/app/components/HorizontalTimeline";
import VerticalTimeline from "@/app/components/VerticalTimeline";
import { getEventsInTimeline } from "@/app/lib/api/getEventsInTimeline";
import { getTimelineFromId } from "@/app/lib/api/getTimelineFromId";
import { EventData, CompareTimelineEventData } from "@/app/models/event";
import { TimelineData } from "@/app/models/timeline";

export default function TimelinePage() {
	const { timelineID } = useParams<{
		timelineID: string;
	}>();

	const [events, setEvents] = useState<EventData[]>([]);
	const [compareEventsData, setCompareEventsData] = useState<CompareTimelineEventData[] | null>(
		null
	);

	// Properties of the timeline
	const [isMultipleSidedTimeline, setIsMultipleSidedTimeline] = useState(false);
	const [isContinuousScaleTimeline, setIsContinuousScaleTimeline] = useState(false);
	const [comparableTimelines, setComparableTimelines] = useState<string[]>([]);
	const [timelineName, setTimelineName] = useState("");

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [verticalSelected, setVerticalSelected] = useState(false);
	const [selectedComparableTimelineID, setSelectedComparableTimelineID] = useState<string | null>(
		null
	);

	useEffect(() => {
		const fetchEventAndTimelineData = async () => {
			try {
				const eventsData = await getEventsInTimeline({ timelineID });
				setEvents(eventsData);

				const timelineData: TimelineData[] = await getTimelineFromId({ timelineID });

				// Set the useState properties based on timeline data
				setTimelineName(timelineData[0].title);
				// Boolean values for multiple view/ continuous scale (true or not present in object)
				setIsContinuousScaleTimeline(!!timelineData[0].continuousScale);
				setIsMultipleSidedTimeline(!!timelineData[0].multipleView);
				// Comparable timelines array (default to empty arr if not present in object)
				setComparableTimelines(timelineData[0].comparableTimelines ?? []);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error whilst fetching data");
			} finally {
				setLoading(false);
			}
		};

		fetchEventAndTimelineData();
	}, [timelineID]);

	useEffect(() => {
		if (selectedComparableTimelineID) {
			const fetchComparisonData = async () => {
				setLoading(true);
				setCompareEventsData(null);
				setError(null);

				try {
					const mainEvents = await getEventsInTimeline({ timelineID });
					// Fetch events for the comparable timeline (side 2)
					const comparableEvents: EventData[] = await getEventsInTimeline({
						timelineID: selectedComparableTimelineID,
					});

					const markedMainEvents: CompareTimelineEventData[] = mainEvents.map((e) => ({
						...e,
						timelineSide: 1,
					}));
					const markedComparableEvents: CompareTimelineEventData[] = comparableEvents.map(
						(e) => ({ ...e, timelineSide: 2 })
					);

					const allEvents = [...markedMainEvents, ...markedComparableEvents].sort(
						(a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
					);

					setCompareEventsData(allEvents);
				} catch (err) {
					setError(
						err instanceof Error
							? err.message
							: "Unknown error whilst fetching comparison data"
					);
				} finally {
					setLoading(false);
				}
			};

			fetchComparisonData();
		} else {
			setCompareEventsData(null);
		}
	}, [timelineID, selectedComparableTimelineID, comparableTimelines]);

	if (loading) {
		return (
			// Loading spinner animation
			<div className="flex justify-center items-center py-4">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
			</div>
		);
	}

	if (error) return <p>Error fetching events: {error}</p>;

	const handleCompareTimelineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedId = e.target.value;
		setSelectedComparableTimelineID(selectedId === "" ? null : selectedId);
	};

	const displayTimeline = () => {
		if (selectedComparableTimelineID && compareEventsData) {
			return <CompareTimelines events={compareEventsData} />;
		}

		if (isMultipleSidedTimeline) {
			return <VerticalTimeline events={events} isTwoSided={true} />;
		}

		if (isContinuousScaleTimeline) {
			return <ContinuousScaleTimeline events={events} />;
		}

		// If not multiple sided: use toggle between vertical and horizontal
		return verticalSelected ? (
			<VerticalTimeline events={events} isTwoSided={false} />
		) : (
			<HorizontalTimeline events={events} />
		);
	};

	return (
		<div>
			{/* Timeline title header */}
			<div className="flex justify-center items-center w-full mb-5 md:mb-8">
				<h1 className="text-3xl">
					{" "}
					<span className="font-bold text-blue-500">{timelineName}</span> Event Timeline
				</h1>
			</div>

			{/* Event filter options */}
			<div className="flex justify-between items-center mb-5 md:mb-10 max-w-full lg:max-w-5/6 ml-auto mr-auto">
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
					<input
						type="text"
						className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
						placeholder="View All"
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

				{/* Display toggle (horizontal/ vertical) if not a two-sided timeline */}
				{!isMultipleSidedTimeline && !isContinuousScaleTimeline && (
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

				{comparableTimelines.length > 0 && (
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
							{comparableTimelines.map((timeline, index) => (
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
