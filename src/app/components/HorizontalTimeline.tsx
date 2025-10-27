"use client";

import { EventData } from "@/app/models/event";

export default function HorizontalTimeline({ events }: { events: EventData[] }) {
  return (
    <div className="mx-auto relative min-h-screen px-2 xs:px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-30 pt-12 xs:pt-16 sm:pt-24 md:pt-32 lg:pt-50 pb-12 xs:pb-16 sm:pb-24 md:pb-32 lg:pb-48">
      <div className="relative flex justify-between items-center gap-4 xs:gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 2xl:gap-24">
        {/* Horizontal Base Line */}
        <div className="absolute left-0 right-0 h-[1px] bg-[var(--foreground)]" />

        {events.map((event, i) => (
          <div key={event._id} className="relative flex flex-col items-center flex-1 min-w-0">

            {/* Vertical line connecting event card to baseline */}
            <div
              className={`absolute w-[1px] border-l border h-6 xs:h-8 sm:h-10 md:h-12 lg:h-16 xl:h-20 ${
                i % 2 === 0 ? "top-0 -translate-y-full" : "bottom-0 translate-y-full"
              }`}
            />

            {/* Alternate between events above/below baseline */}
            <div
              className={`absolute w-28 xs:w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 2xl:w-72 text-left border rounded-lg sm:rounded-xl p-2 sm:p-2.5 md:p-3 lg:p-4 shadow-sm backdrop-blur-sm ${
                i % 2 === 0 
                  ? "bottom-full mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20" 
                  : "top-full mt-6 xs:mt-8 sm:mt-10 md:mt-12 lg:mt-16 xl:mt-20"
              }`}
            >
              <h3 className="xs:text-xs sm:text-sm md:text-base lg:text-md leading-tight xs:leading-snug sm:leading-normal break-words">
                {event.overview}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}