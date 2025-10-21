"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getEventsInTimeline } from "@/app/lib/api/getEventsInTimeline";
import { EventData } from "@/app/models/event";

export default function TimelinePage() {
    const { timelineID } = useParams<{ timelineID: string }>();
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEventsInTimeline({ timelineID });
                setEvents(data);
            } 
            catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } 
            finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [timelineID]);

    if (loading) {
        return (
            // Loading spinner animation
            <div className="flex justify-center items-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    };
    
    if (error) return <p>Error fetching events: {error}</p>;

    return (
        <div className="p-6 space-y-4">
            {events.length === 0 ? (
                <p>No events found for this timeline.</p>
            ) : (
                <ul className="space-y-2">
                    {events.map((event) => (
                        <li key={event._id} className="p-4 rounded-lg shadow bg-gray-50 dark:bg-gray-800">
                            <h2 className="text-lg font-semibold">{event.overview}</h2>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}