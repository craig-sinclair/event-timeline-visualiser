import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from "vitest";

import { exportTimelineHtml } from "@/app/lib/exportTimelineHTML";

describe("exportTimelineAsHtml", () => {
	let mockElement: HTMLDivElement;
	let createElementSpy: MockInstance<typeof document.createElement>;
	let createObjectURLSpy: MockInstance<typeof URL.createObjectURL>;
	let clickSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		// Mock DOM element with dummy content
		mockElement = document.createElement("div");
		mockElement.innerHTML = '<div class="timeline">Test Content</div>';

		createElementSpy = vi.spyOn(document, "createElement");
		createObjectURLSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");

		clickSpy = vi.fn();
		createElementSpy.mockReturnValue({
			click: clickSpy,
			href: "",
			download: "",
		} as Partial<HTMLAnchorElement> as HTMLAnchorElement);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("should return early if timelineRef is null", () => {
		exportTimelineHtml(null);

		expect(createElementSpy).not.toHaveBeenCalled();
		expect(createObjectURLSpy).not.toHaveBeenCalled();
	});

	it("should create an object URL from the blob", () => {
		exportTimelineHtml(mockElement);

		expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
	});

	it("should create a download link with correct attributes", () => {
		const mockDate = new Date("2024-01-15");
		vi.setSystemTime(mockDate);

		exportTimelineHtml(mockElement);

		const linkElement = createElementSpy.mock.results[0].value;
		expect(linkElement.href).toBe("blob:mock-url");
		expect(linkElement.download).toBe(`timeline-2024-01-15.html`);
	});

	it("should generate valid HTML structure", () => {
		exportTimelineHtml(mockElement);

		// Get the blob that was passed to createObjectURL
		const blob = createObjectURLSpy.mock.calls[0][0] as Blob;

		expect(blob).toBeInstanceOf(Blob);
		expect(blob.type).toBe("text/html");
		expect(blob.size).toBeGreaterThan(0);

		expect(mockElement.innerHTML).toContain("Test Content");
	});

	it("should handle errors gracefully", () => {
		// Force an error by making cloneNode throw
		vi.spyOn(mockElement, "cloneNode").mockImplementation(() => {
			throw new Error("Clone failed");
		});

		expect(() => exportTimelineHtml(mockElement)).toThrow("Clone failed");
	});
});
