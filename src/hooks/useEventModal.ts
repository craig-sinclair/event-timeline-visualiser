import { useState } from "react";

import { EventData, CompareTimelineEventData } from "@/models/event";

export function useEventModal<T extends EventData | CompareTimelineEventData>() {
	const [isEventModalOpen, setIsEventModalOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<T | null>(null);

	const openEventModal = (event: T) => {
		setSelectedEvent(event);
		setIsEventModalOpen(true);
	};

	const closeEventModal = () => {
		setIsEventModalOpen(false);
		setSelectedEvent(null);
	};

	return {
		isEventModalOpen,
		selectedEvent,
		openEventModal,
		closeEventModal,
	};
}
