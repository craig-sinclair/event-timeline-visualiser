/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { SAMPLE_EVENTS } from "../sample-data/sample-events";

import HorizontalTimeline from "@/components/VerticalTimeline";
import { EventData } from "@/models/event";

// Mock EventModal component for quick tests on its interaction here
vi.mock("@/components/modals/EventModal", () => ({
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

describe("Horizontal timeline tests", () => {
	it("renders all event overviews", () => {
		render(<HorizontalTimeline events={SAMPLE_EVENTS as EventData[]} />);

		for (const event of SAMPLE_EVENTS) {
			const eventOverview = screen.getByText(event.overview);
			expect(eventOverview).toBeInTheDocument();
		}
	});

	it("opens modal when event is clicked", () => {
		render(<HorizontalTimeline events={SAMPLE_EVENTS as EventData[]} />);
		const [firstEvent] = screen.getAllByText(SAMPLE_EVENTS[0].overview);

		fireEvent.click(firstEvent);
		expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
	});

	it("passes the clicked event to modal", () => {
		render(<HorizontalTimeline events={SAMPLE_EVENTS as EventData[]} />);
		const [secondEvent] = screen.getAllByText(SAMPLE_EVENTS[1].overview);

		fireEvent.click(secondEvent);
		expect(screen.getAllByText(SAMPLE_EVENTS[1].overview)[1]).toBeInTheDocument();
	});

	it("closes modal when close button is clicked", () => {
		render(<HorizontalTimeline events={SAMPLE_EVENTS as EventData[]} />);
		const [firstEvent] = screen.getAllByText(SAMPLE_EVENTS[0].overview);
		fireEvent.click(firstEvent);

		const closeButton = screen.getByText("Close");
		fireEvent.click(closeButton);

		expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
	});
});
