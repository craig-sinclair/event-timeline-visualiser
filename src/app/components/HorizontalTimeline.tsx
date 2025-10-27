"use client"

import { EventData } from "@/app/models/event"

export default function HorizontalTimeline({events}: {events: EventData[]}) {
    return (
        <>        
            <ul className="space-y-2">
                {events.map((event) => (
                    <li key={event._id} className="p-4 rounded-lg shadow bg-gray-50 dark:bg-gray-800">
                        <h2 className="text-lg font-semibold">{event.overview}</h2>
                    </li>
                ))}
            </ul>
        </>

    )
}