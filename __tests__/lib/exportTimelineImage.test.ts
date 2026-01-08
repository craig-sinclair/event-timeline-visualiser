import * as htmlToImage from "html-to-image";
import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from "vitest";

import { exportTimelineImage } from "@/app/lib/exportTimelineImage";

vi.mock("html-to-image");

describe("exportTimelineAsImage", () => {
	let mockElement: HTMLDivElement;
	let createElementSpy: MockInstance<typeof document.createElement>;
	let clickSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		// Mock DOM content and style properties
		mockElement = document.createElement("div");
		mockElement.innerHTML = '<div class="timeline">Test Content</div>';
		mockElement.style.overflow = "auto";
		mockElement.style.maxHeight = "500px";

		// Mock scrollWidth/scrollHeight
		Object.defineProperty(mockElement, "scrollWidth", { value: 1200, writable: true });
		Object.defineProperty(mockElement, "scrollHeight", { value: 800, writable: true });

		clickSpy = vi.fn();
		createElementSpy = vi.spyOn(document, "createElement");
		createElementSpy.mockReturnValue({
			click: clickSpy,
			href: "",
			download: "",
		} as Partial<HTMLAnchorElement> as HTMLAnchorElement);

		// Mock toPng to return a data URL
		vi.mocked(htmlToImage.toPng).mockResolvedValue("data:image/png;base64,mockImageData");

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("should return early if timelineRef is null", async () => {
		await exportTimelineImage(null);
		expect(htmlToImage.toPng).not.toHaveBeenCalled();
	});

	it("should add and remove export-mode class", async () => {
		const addClassSpy = vi.spyOn(mockElement.classList, "add");
		const removeClassSpy = vi.spyOn(mockElement.classList, "remove");

		const promise = exportTimelineImage(mockElement);
		await vi.advanceTimersByTimeAsync(100);
		await promise;

		// Verify class was added and then removed
		expect(addClassSpy).toHaveBeenCalledWith("export-mode");
		expect(removeClassSpy).toHaveBeenCalledWith("export-mode");
		expect(mockElement.classList.contains("export-mode")).toBe(false);
	});

	it("should create download link with correct attributes", async () => {
		const mockDate = new Date("2024-01-15");
		vi.setSystemTime(mockDate);

		const promise = exportTimelineImage(mockElement);

		await vi.advanceTimersByTimeAsync(100);
		await promise;

		const linkElement = createElementSpy.mock.results[0].value;
		expect(linkElement.href).toBe("data:image/png;base64,mockImageData");
		expect(linkElement.download).toBe("timeline-2024-01-15.png");
		expect(clickSpy).toHaveBeenCalledTimes(1);
	});

	it("should restore styles even if toPng fails", async () => {
		vi.mocked(htmlToImage.toPng).mockRejectedValueOnce(new Error("Export failed"));

		const promise = exportTimelineImage(mockElement).catch((error) => error);
		await vi.advanceTimersByTimeAsync(100);

		const result = await promise;
		expect(result).toEqual(new Error("Export failed"));

		expect(mockElement.style.overflow).toBe("auto");
		expect(mockElement.style.maxHeight).toBe("500px");
		expect(mockElement.classList.contains("export-mode")).toBe(false);
	});
});
