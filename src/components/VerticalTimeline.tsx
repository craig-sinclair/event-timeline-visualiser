"use client";
import { useRef, useState } from "react";

import EventModal from "@/components/ui/EventModal";
import ExportTimelineModal from "@/components/ui/ExportTimelineModal";
import { useEventModal } from "@/hooks/useEventModal";
import { createEventCardStyle } from "@/lib/createEventCardStyle";
import { EventData } from "@/models/event";

export default function VerticalTimeline({
	events,
	isTwoSided = false,
	leftLabel = "",
	rightLabel = "",
	exportVisible = true,
}: {
	events: EventData[];
	isTwoSided?: boolean;
	leftLabel?: string;
	rightLabel?: string;
	exportVisible?: boolean;
}) {
	const { isEventModalOpen, selectedEvent, openEventModal, closeEventModal } =
		useEventModal<EventData>();

	const [isExportTimelineModalOpen, setIsExportTimelineModalOpen] = useState<boolean>(false);
	const timelineRef = useRef<HTMLDivElement>(null);

	return (
		<>
			<div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
				{exportVisible && (
					<button
						onClick={() => setIsExportTimelineModalOpen(true)}
						disabled={isExportTimelineModalOpen}
						className="border-white border p-2 text-md cursor-pointer mb-10"
					>
						Export Timeline
					</button>
				)}

				<div className="relative" ref={timelineRef} data-export-root>
					{isTwoSided && (
						<div className="flex justify-between text-sm sm:text-base mb-8">
							<span className="text-2xl font-semibold px-3 py-1 rounded-sm bg-red-900/30 text-red-400 shadow-sm">
								{leftLabel}
							</span>
							<span className="text-2xl font-semibold px-3 py-1 rounded-sm bg-blue-900/30 text-blue-400 shadow-sm">
								{rightLabel}
							</span>
						</div>
					)}

					{/* Vertical timeline line */}
					<div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-[#171717] dark:bg-[#ededed] opacity-20" />

					{/* Events */}
					<div className="space-y-8 sm:space-y-12">
						{events.map((event, i) => (
							<div
								key={event._id}
								className={`relative flex items-center gap-4 sm:gap-8 ${
									// If not a two sided timeline, alternate display direction (either side of centre baseline)
									!isTwoSided
										? i % 2 === 0
											? "sm:flex-row"
											: "sm:flex-row-reverse"
										: // If is a two-sided timeline, display events (positionally) based on their side
											event.side === 1
											? "sm:flex-row"
											: "sm:flex-row-reverse"
								}`}
							>
								{/* Timeline dot */}
								<div className="absolute left-4 sm:left-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900 -translate-x-1/2 z-10" />

								{/* Spacer for alternating layout on larger screens */}
								<div className="hidden sm:block sm:w-1/2" />

								{/* Event card */}
								<div
									style={createEventCardStyle({ relevance: event.relevance })}
									className="ml-12 sm:ml-0 sm:w-1/2 border rounded-lg hover:shadow-lg hover:opacity-75 transition-all duration-200 cursor-pointer"
									onClick={() => openEventModal(event)}
								>
									<h3 className="font-medium leading-snug">{event.overview}</h3>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<EventModal
				visible={isEventModalOpen}
				event={selectedEvent}
				onClose={closeEventModal}
			/>

			<ExportTimelineModal
				isVisible={isExportTimelineModalOpen}
				timelineRef={timelineRef}
				onClose={() => setIsExportTimelineModalOpen(false)}
			/>
		</>
	);
}
