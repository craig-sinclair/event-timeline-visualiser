/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { SAMPLE_EVENTS } from "../sample-data/sample-events";

import VerticalTimeline from "@/app/components/VerticalTimeline";
import { EventData } from "@/app/models/event";

// Mock EventModal component for quick tests on its interaction here
vi.mock("@/app/components/ui/EventModal", () => ({
	__esModule: true,
	default: ({
		visible,
		event,
		onClose,
	}: {
		visible: boolean;
		event: EventData | null;
		onClose: () => void;
	}) =>
		visible ? (
			<div data-testid="mock-modal">
				<p>{event?.overview}</p>
				<button onClick={onClose}>Close</button>
			</div>
		) : null,
}));

describe("Vertical timeline tests", () => {
	it("renders all event overviews", () => {
		render(<VerticalTimeline events={SAMPLE_EVENTS as EventData[]} />);

		for (const event of SAMPLE_EVENTS) {
			const eventOverview = screen.getByText(event.overview);
			expect(eventOverview).toBeInTheDocument();
		}
	});

	it("opens modal when event is clicked", () => {
		render(<VerticalTimeline events={SAMPLE_EVENTS as EventData[]} />);
		const [firstEvent] = screen.getAllByText(SAMPLE_EVENTS[0].overview);

		fireEvent.click(firstEvent);
		expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
	});

	it("passes the clicked event to modal", () => {
		render(<VerticalTimeline events={SAMPLE_EVENTS as EventData[]} />);
		const [secondEvent] = screen.getAllByText(SAMPLE_EVENTS[1].overview);

		fireEvent.click(secondEvent);
		expect(screen.getAllByText(SAMPLE_EVENTS[1].overview)[1]).toBeInTheDocument();
	});

	it("closes modal when close button is clicked", () => {
		render(<VerticalTimeline events={SAMPLE_EVENTS as EventData[]} />);
		const [firstEvent] = screen.getAllByText(SAMPLE_EVENTS[0].overview);
		fireEvent.click(firstEvent);

		const closeButton = screen.getByText("Close");
		fireEvent.click(closeButton);

		expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
	});

	it("applies alternating layout classes", () => {
		render(<VerticalTimeline events={SAMPLE_EVENTS as EventData[]} />);
		const eventCards = screen.getAllByRole("heading");

		// Even index should have normal direction, odd should have reversed layout
		const parentDivs = eventCards.map((el) => el.closest("div.relative"));
		expect(parentDivs[0]?.className).toContain("sm:flex-row");
		expect(parentDivs[1]?.className).toContain("sm:flex-row-reverse");
	});
});
