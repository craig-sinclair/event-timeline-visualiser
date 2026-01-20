"use client";

import { useState, useRef } from "react";

import EventModal from "@/components/modals/EventModal";
import ExportTimelineModal from "@/components/modals/ExportTimelineModal";
import { useEventModal } from "@/hooks/useEventModal";
import { createEventCardStyle } from "@/lib/createEventCardStyle";
import { EventData } from "@/models/event";

export default function HorizontalTimeline({ events }: { events: EventData[] }) {
	const { isEventModalOpen, selectedEvent, openEventModal, closeEventModal } =
		useEventModal<EventData>();

	const [isExportTimelineModalOpen, setIsExportTimelineModalOpen] = useState<boolean>(false);

	const timelineRef = useRef<HTMLDivElement>(null);

	return (
		<>
			<button
				onClick={() => setIsExportTimelineModalOpen(true)}
				disabled={isExportTimelineModalOpen}
				className="border-white border p-2 text-md cursor-pointer mb-10"
			>
				Export Timeline
			</button>
			<div
				className="w-full overflow-x-auto pt-12 xs:pt-16 sm:pt-24 md:pt-32 lg:pt-50 pb-32 xs:pb-36 sm:pb-44 md:pb-52 lg:pb-60 overflow-y-hidden"
				ref={timelineRef}
				data-export-root
			>
				<div className="relative inline-flex items-center min-w-full px-2 xs:px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-30">
					{/* Horizontal Base Line */}
					<div
						className="absolute left-0 right-0 h-[1px] bg-[var(--foreground)]"
						style={{ width: "100%" }}
					/>

					{events.map((event, i) => (
						<div
							key={event._id}
							className="relative flex flex-col items-center flex-shrink-0"
							style={{ width: "224px" }}
						>
							{/* Vertical line connecting event card to baseline */}
							<div
								className={`absolute w-[1px] border-l border h-6 xs:h-8 sm:h-10 md:h-12 lg:h-16 xl:h-20 ${
									i % 2 === 0
										? "top-0 -translate-y-full"
										: "bottom-0 translate-y-full"
								}`}
							/>

							{/* Alternate between events above/below baseline */}
							<div
								className={`w-full text-left border rounded-lg hover:opacity-75 transition-all duration-200 cursor-pointer ${
									i % 2 === 0
										? "absolute bottom-full mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20"
										: "absolute top-full mt-6 xs:mt-8 sm:mt-10 md:mt-12 lg:mt-16 xl:mt-20"
								}`}
								onClick={() => openEventModal(event)}
								style={createEventCardStyle({
									relevance: event.relevance,
									paddingMultiplier: 0.6,
									fontSizeMultiplier: 0.85,
								})}
							>
								<h3 className="leading-tight xs:leading-snug sm:leading-normal break-words">
									{event.overview}
								</h3>
							</div>
						</div>
					))}
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
