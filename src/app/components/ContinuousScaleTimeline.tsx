"use client";

import { useState } from "react";

import EventModal from "@/app/components/ui/EventModal";
import { EventData } from "@/app/models/event";

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

	// Todo: Fixed labels for two sides for UK Climate example for now; update to be dynamic based on input timeline
	const leftLabel = "Climate Skepticism";
	const rightLabel = "Climate Emergency Action";

	// Helper function to get appropriate colour (on gradient scale) for an event
	// Based upon the event's position value (agreement on continuous scale to a side) between 0.0 and 1.0
	const getEventColor = (position: number) => {
		const r = Math.round(220 * (1 - position) + 34 * position);
		const g = Math.round(38 * (1 - position) + 197 * position);
		const b = Math.round(38 * (1 - position) + 94 * position);
		return `rgb(${r}, ${g}, ${b})`;
	};

	return (
		<>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
				{/* Header with header labels for opposite sides of scale */}
				<div className="mb-12">
					<div className="flex justify-between items-center mb-4">
						<span className="text-lg sm:text-xl font-semibold px-4 py-2 rounded-full bg-red-900/30 text-red-400">
							{leftLabel}
						</span>
						<span className="text-lg sm:text-xl font-semibold px-4 py-2 rounded-full bg-green-900/30 text-green-400">
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
							};
							
							// Determine placement of events based on event's position value...
							// Is a value between 0.0 and 1.0 that reflects extend of agreement to side in continuous scale format
							const horizontalPercent = 10 + event.position * 80;
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
											transform: `translateX(${isLeft ? horizontalPercent - 20 : horizontalPercent - 60}%)`,
										}}
									>
										<div
											className="border-2 rounded-lg p-4 cursor-pointer transition-all hover:opacity-75"
											style={{ borderColor: getEventColor(event.position) }}
											onClick={() => handleEventClick(event)}
										>
											<div className="flex items-start gap-3">
												{/* Event overview text */}
												<div className="flex-1">
													<h3 className="text-sm sm:text-base font-semibold leading-snug">
														{event.overview}
													</h3>
												</div>

												{/* Event % position on scale (colour appropriate) */}
												<div
													className="text-xs font-bold px-2 py-1 rounded"
													style={{
														backgroundColor: `${getEventColor(event.position)}20`,
														color: getEventColor(event.position),
													}}
												>
													{(event.position * 100).toFixed(0)}%
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
				onClose={handleCloseModal}
			/>
		</>
	);
}
