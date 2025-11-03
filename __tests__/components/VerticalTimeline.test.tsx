/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react";

import VerticalTimeline from "@/app/components/VerticalTimeline";
import { EventData } from "@/app/models/event";
import { SAMPLE_EVENTS } from "../sample-data/sample-events";

// Mock EventModal component for quick tests on its interaction here
vi.mock("@/app/components/ui/EventModal", () => ({
    __esModule: true,
    default: ({ visible, event, onClose }: { visible: boolean; event: EventData | null; onClose: () => void; }) => (
        visible ? (
            <div data-testid="mock-modal">
                <p>{event?.overview}</p>
                <button onClick={onClose}>Close</button>
            </div>
        ) : null
    )
}));

describe("Vertical timeline tests", () => {
    it("renders all event overviews", () => {
        render(<VerticalTimeline events={SAMPLE_EVENTS as EventData[]} />);

        for (let event of SAMPLE_EVENTS) {
            const eventOverview = screen.getByText(event.overview);
            expect(eventOverview).toBeInTheDocument();
        }
    });

    it("applies alternating layout classes", () => {
        render(<VerticalTimeline events={SAMPLE_EVENTS as EventData[]} />);
        const eventCards = screen.getAllByRole("heading");

        // Even index should have normal direction, odd should have reversed layout
        const parentDivs = eventCards.map(el => el.closest("div.relative"));
        expect(parentDivs[0]?.className).toContain("sm:flex-row");
        expect(parentDivs[1]?.className).toContain("sm:flex-row-reverse");
    });
})