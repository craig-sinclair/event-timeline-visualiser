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
        <div>
            {/* Timeline title header */}
            <div className="flex justify-center items-center w-full mb-5 md:mb-8">
                <h1 className="text-3xl"> <span className="font-bold text-blue-500">Brexit Campaign</span> Event Timeline</h1>
            </div>

            {/* Event filter options */}
            <div className="flex justify-between items-center mb-5 md:mb-10 max-w-full md:max-w-4/5 lg:max-w-3/4 ml-auto mr-auto">
                <div>
                    <label className="block mb-2 text-xs md:text-sm">Date Range</label>
                    <input type="text"className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
                        placeholder="All Time" />
                </div>

                <div>
                    <label className="block mb-2 text-xs md:text-sm">Tags</label>
                    <input type="text" className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
                        placeholder="View All" />
                </div>

                <div>
                    <label className="block mb-2 text-xs md:text-sm">Min. Relevance</label>
                    <input type="text" className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
                        placeholder="High" />
                </div>

                <div>
                    <label className="block mb-2 text-xs md:text-sm">Sort By</label>
                    <input type="text" className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
                        placeholder="Chronological" />
                </div>
            </div>


            {events.length === 0 ? (
                <p>No events found for this timeline.</p>
            ) : (
                <>
                    <ul className="space-y-2">
                        {events.map((event) => (
                            <li key={event._id} className="p-4 rounded-lg shadow bg-gray-50 dark:bg-gray-800">
                                <h2 className="text-lg font-semibold">{event.overview}</h2>
                            </li>
                        ))}
                    </ul>
                </>

            )}
        </div>
    );
}