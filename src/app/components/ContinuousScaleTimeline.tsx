"use client";
import { useState, useRef } from "react";

import { useEventModal } from "@/app//hooks/useEventModal";
import EventModal from "@/app/components/ui/EventModal";
import ExportTimelineModal from "@/app/components/ui/ExportTimelineModal";
import { createEventCardStyle } from "@/app/lib/createEventCardStyle";
import { getEventColor } from "@/app/lib/getEventColour";
import { EventData } from "@/app/models/event";

export default function VerticalTimeline({
	events,
	leftLabel = "",
	rightLabel = "",
}: {
	events: EventData[];
	leftLabel: string;
	rightLabel: string;
}) {
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
				className="max-w-6xl mx-auto sm:px-6 py-8 sm:py-12 overflow-x-hidden"
				ref={timelineRef}
				data-export-root
			>
				{/* Header with header labels for opposite sides of scale */}
				<div className="mb-12">
					<div className="flex justify-between items-center mb-4">
						<span className="text-xs sm:text-lg md:text-xl font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-sm bg-red-900/30 text-red-400">
							{leftLabel}
						</span>
						<span className="text-xs sm:text-lg md:text-xl font-semiboldpx-3 sm:px-4 py-1 sm:py-2 rounded-sm bg-green-900/30 text-green-400">
							{rightLabel}
						</span>
					</div>

					{/* Bar to display gradient of colours corresponding to scale */}
					<div className="h-2 rounded-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 opacity-40" />
				</div>

				<div className="relative">
					{/* Centre vertical line */}
					<div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700 -translate-x-1/2" />

					<div className="space-y-16">
						{events.map((event, _) => {
							if (event.position == null) {
								return null;
							}

							// Determine placement of events based on event's position value...
							// Is a value between 0.0 and 1.0 that reflects extend of agreement to side in continuous scale format
							const horizontalPercent = 10 + event.position * 70;
							const isLeft = event.position < 0.5;

							return (
								<div key={event._id} className="relative">
									{/* Dashed connecting line from centre baseline to single event card */}
									<svg
										className="absolute top-8 w-full h-12 pointer-events-none"
										style={{ left: 0 }}
									>
										<line
											x1="50%"
											y1="0"
											x2={`${horizontalPercent}%`}
											y2="100%"
											stroke="currentColor"
											strokeWidth="2"
											strokeDasharray="4 4"
											className="text-gray-300 dark:text-gray-700"
										/>
									</svg>

									{/* Event card positioned according to position value (its opinion on continuous scale) */}
									<div
										className="relative pt-20"
										style={{
											marginLeft: isLeft ? "0" : "auto",
											marginRight: isLeft ? "auto" : "0",
											width: "40%",
											transform: `translateX(${isLeft ? horizontalPercent - 20 : horizontalPercent - 80}%)`,
										}}
									>
										<div
											className="border-2 rounded-lg p-4 cursor-pointer transition-all hover:opacity-75"
											style={{
												borderColor: getEventColor(event.position),
												...createEventCardStyle({
													relevance: event.relevance,
												}),
											}}
											onClick={() => openEventModal(event)}
										>
											<div className="flex items-start gap-3">
												{/* Event overview text */}
												<div className="flex-1">
													<h3 className="font-semibold leading-snug">
														{event.overview}
													</h3>
												</div>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* Modal popup for specific event view */}
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
