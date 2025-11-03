/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react";

import VerticalTimeline from "@/app/components/VerticalTimeline";
import { EventData } from "@/app/models/event";
import { SAMPLE_EVENTS } from "../sample-data/sample-events";

describe("Vertical timeline tests", () => {
    it("renders all event overviews", () => {
        render(<VerticalTimeline events={SAMPLE_EVENTS as EventData[]} />);
        
        for (let event of SAMPLE_EVENTS) {
            const eventOverview = screen.getByText(event.overview);
            expect(eventOverview).toBeInTheDocument();
        }
    });
})