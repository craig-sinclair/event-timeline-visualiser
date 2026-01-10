"use client";

import { useState, useRef } from "react";

import EventModal from "@/app/components/ui/EventModal";
import ExportTimelineModal from "@/app/components/ui/ExportTimelineModal";
import { useEventModal } from "@/app/hooks/useEventModal";
import { createEventCardStyle } from "@/app/lib/createEventCardStyle";
import { getEventColor } from "@/app/lib/getEventColour";
import { CompareTimelineEventData } from "@/app/models/event";

export default function CompareTimelines({
	events,
	leftLabel = "",
	rightLabel = "",
	timelineOneLabel = "",
	timelineTwoLabel = "",
}: {
	events: CompareTimelineEventData[];
	leftLabel: string;
	rightLabel: string;
	timelineOneLabel: string;
	timelineTwoLabel: string;
}) {
	const { isEventModalOpen, selectedEvent, openEventModal, closeEventModal } =
		useEventModal<CompareTimelineEventData>();

	const [isExportTimelineModalOpen, setIsExportTimelineModalOpen] = useState<boolean>(false);

	const timelineRef = useRef<HTMLDivElement>(null);

	// Get timeline-specific styling
	const getTimelineStyle = (timelineSide: number) => {
		if (timelineSide === 1) {
			return {
				borderColor: "#3b82f6", // blue
				badgeBg: "bg-blue-100 dark:bg-blue-900/30",
				badgeText: "text-blue-700 dark:text-blue-400",
			};
		} else {
			return {
				borderColor: "#ef4444", // red
				badgeBg: "bg-red-100 dark:bg-red-900/30",
				badgeText: "text-red-700 dark:text-red-400",
			};
		}
	};

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
				className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 overflow-x-hidden"
				ref={timelineRef}
				data-export-root
			>
				{/* Header with scale labels */}
				<div className="mb-12">
					<div className="flex justify-between items-center mb-4">
						<span className="text-xs sm:text-lg md:text-xl font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-sm bg-red-900/30 text-red-400">
							{leftLabel}
						</span>
						<span className="text-xs sm:text-lg md:text-xl font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-sm bg-green-900/30 text-green-400">
							{rightLabel}
						</span>
					</div>

					{/* Gradient bar */}
					<div className="h-2 rounded-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 opacity-40" />

					{/* Timeline legend */}
					<div className="flex justify-center gap-6 mt-6">
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 rounded border-2 border-blue-500" />
							<span className="text-sm font-medium">{timelineTwoLabel}</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 rounded border-2 border-red-500" />
							<span className="text-sm font-medium">{timelineOneLabel}</span>
						</div>
					</div>
				</div>

				<div className="relative">
					{/* Center vertical line */}
					<div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700 -translate-x-1/2" />

					<div className="space-y-16">
						{events.map((event) => {
							if (event.position == null) return null;

							const horizontalPercent = 10 + event.position * 70;
							const isLeft = event.position < 0.5;
							const timelineStyle = getTimelineStyle(event.timelineSide);

							return (
								<div key={event._id} className="relative">
									{/* Connecting line */}
									<svg
										className="absolute top-8 w-full h-12 pointer-events-none"
										style={{ left: 0 }}
									>
										<line
											x1="50%"
											y1="0"
											x2={`${horizontalPercent + 5}%`}
											y2="100%"
											stroke={timelineStyle.borderColor}
											strokeWidth="2"
											strokeDasharray="4 4"
											opacity="0.5"
										/>
									</svg>

									{/* Event card */}
									<div
										className="relative pt-20"
										style={{
											marginLeft: isLeft ? "0" : "auto",
											marginRight: isLeft ? "auto" : "0",
											width: "40%",
											transform: `translateX(${isLeft ? horizontalPercent - 20 : horizontalPercent - 75}%)`,
										}}
									>
										<div
											className="border-2 rounded-lg cursor-pointer transition-all hover:opacity-75 hover:shadow-lg"
											style={{
												borderColor: timelineStyle.borderColor,
												backgroundColor: `${getEventColor(event.position)}10`,
												...createEventCardStyle({
													relevance: event.relevance,
													paddingMultiplier: 0.75,
												}),
											}}
											onClick={() => openEventModal(event)}
										>
											<div className="flex items-start gap-3">
												<div className="flex-1">
													{/* Timeline badge */}
													<div className="flex items-center mb-2">
														<span
															className={`text-xs font-semibold px-2 py-0.5 rounded ${timelineStyle.badgeBg} ${timelineStyle.badgeText}`}
														>
															{event.timelineSide === 1
																? timelineTwoLabel
																: timelineOneLabel}
														</span>
													</div>

													{/* Event overview */}
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
