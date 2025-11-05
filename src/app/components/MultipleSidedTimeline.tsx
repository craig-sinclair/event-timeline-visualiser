"use client";

import { EventData } from "@/app/models/event";
import { useState } from "react";
import EventModal from "@/app/components/ui/EventModal";

export default function MultipleSidedTimeline({ events }: { events: EventData[] }) {
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

    // For now hardcode labels (must be passed from timeline)
    const leftLabel: String = "Leave";
    const rightLabel: String = "Remain";

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
            <h1>Multiple Sided</h1>
        </>
    );
}