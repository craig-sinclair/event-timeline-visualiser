import { toPng } from "html-to-image";

export const exportTimelineAsImage = async (timelineRef: HTMLDivElement | null): Promise<void> => {
	if (!timelineRef) return;

	const element = timelineRef;

	const originalOverflow = element.style.overflow;
	const originalMaxHeight = element.style.maxHeight;

	element.style.overflow = "visible";
	element.style.maxHeight = "none";

	element.classList.add("export-mode");
	await new Promise((r) => setTimeout(r, 100));

	try {
		const dataUrl = await toPng(element, {
			quality: 1,
			pixelRatio: 2,
			width: element.scrollWidth,
			height: element.scrollHeight,
			skipFonts: true,
		});

		const link = document.createElement("a");
		link.download = `timeline-${new Date().toISOString().slice(0, 10)}.png`;
		link.href = dataUrl;
		link.click();
	} catch (error) {
		console.error("Error during exporting timeline image", error);
		throw error;
	} finally {
		element.classList.remove("export-mode");
		element.style.overflow = originalOverflow;
		element.style.maxHeight = originalMaxHeight;
	}
};
