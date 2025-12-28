import { useState, useEffect } from "react";

import { getEventsInTimeline } from "@/app/lib/api/getEventsInTimeline";
import { CompareTimelineEventData } from "@/app/models/event";

export function useTimelineComparisonData(
	timelineID: string,
	selectedComparableTimelineID: string | null
) {
	const [compareData, setCompareData] = useState<CompareTimelineEventData[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedComparableTimelineID) {
			setCompareData(null);
			setLoading(false);
			setError(null);
			return;
		}

		const fetchComparisonData = async () => {
			setLoading(true);
			setCompareData(null);
			setError(null);

			try {
				// Fetch events from both timelines
				const [mainEvents, comparableEvents] = await Promise.all([
					getEventsInTimeline({ timelineID }),
					getEventsInTimeline({ timelineID: selectedComparableTimelineID }),
				]);

				// Mark each set of events with corresponding timeline side
				const markedMainEvents: CompareTimelineEventData[] = mainEvents.map((e) => ({
					...e,
					timelineSide: 1,
				}));

				const markedComparableEvents: CompareTimelineEventData[] = comparableEvents.map(
					(e) => ({
						...e,
						timelineSide: 2,
					})
				);

				// Combine and sort by date
				const allEvents = [...markedMainEvents, ...markedComparableEvents].sort(
					(a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
				);

				setCompareData(allEvents);
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
	}, [timelineID, selectedComparableTimelineID]);

	return { compareData, loading, error };
}
