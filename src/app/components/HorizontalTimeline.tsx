"use client";

import EventModal from "@/app/components/ui/EventModal";
import { useEventModal } from "@/app/hooks/useEventModal";
import { EventData } from "@/app/models/event";

export default function HorizontalTimeline({ events }: { events: EventData[] }) {
	const { isEventModalOpen, selectedEvent, openEventModal, closeEventModal } =
		useEventModal<EventData>();

	return (
		<>
			<div className="w-full overflow-x-auto pt-12 xs:pt-16 sm:pt-24 md:pt-32 lg:pt-50 pb-32 xs:pb-36 sm:pb-44 md:pb-52 lg:pb-60 overflow-y-hidden">
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
								className={`w-full text-left border rounded-lg p-2 sm:p-2.5 md:p-3 lg:p-4 hover:opacity-75 transition-all duration-200 cursor-pointer ${
									i % 2 === 0
										? "absolute bottom-full mb-6 xs:mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20"
										: "absolute top-full mt-6 xs:mt-8 sm:mt-10 md:mt-12 lg:mt-16 xl:mt-20"
								}`}
								onClick={() => openEventModal(event)}
							>
								<h3 className="xs:text-xs sm:text-sm md:text-base lg:text-md leading-tight xs:leading-snug sm:leading-normal break-words">
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
		</>
	);
}
