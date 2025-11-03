"use client";

import { EventData } from "@/app/models/event";
import { useState } from "react";
import EventModal from "@/app/components/ui/EventModal";

export default function VerticalTimeline({ events }: { events: EventData[] }) {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--foreground)] opacity-20" />

          {/* Events */}
          <div className="space-y-8 sm:space-y-12">
            {events.map((event, i) => (
              <div
                key={event._id}
                className={`relative flex items-center gap-4 sm:gap-8 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900 -translate-x-1/2 z-10" />

                {/* Spacer for alternating layout on larger screens */}
                <div className="hidden sm:block sm:w-1/2" />

                {/* Event card */}
                <div
                  className="ml-12 sm:ml-0 sm:w-1/2 border rounded-lg p-4 hover:shadow-lg hover:opacity-75 transition-all duration-200 cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  <h3 className="text-sm sm:text-base md:text-lg font-medium leading-snug">
                    {event.overview}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EventModal
        visible={isEventModalOpen}
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </>
  );
}