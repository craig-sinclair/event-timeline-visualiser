"use client";

import { useState, RefObject } from "react";

import { exportTimelineHtml } from "@/lib/exportTimelineHTML";
import { exportTimelineImage } from "@/lib/exportTimelineImage";

export default function ExportTimelineModal({
	isVisible,
	timelineRef,
	onClose,
}: {
	isVisible: boolean;
	timelineRef: RefObject<HTMLDivElement | null>;
	onClose: () => void;
}) {
	const [isExportingTimeline, setIsExportingTimeline] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");

	const handleTimelineExport = async (
		exportFunction: (timelineRef: HTMLDivElement | null) => Promise<void>
	) => {
		if (!timelineRef) return;

		setIsExportingTimeline(true);
		try {
			await exportFunction(timelineRef.current);
			setErrorMessage("");
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred whilst exporting the timeline.";
			setErrorMessage(message);
		} finally {
			setIsExportingTimeline(false);
		}
	};

	if (!isVisible || !timelineRef) {
		return null;
	}

	return (
		<>
			{/* Backdrop */}
			<div className="fixed inset-0 dark:bg-black/99 bg-white/99 z-40" onClick={onClose} />

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="bg-[var(--background)] border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5">
					{/* Header */}
					<div className="flex justify-between items-start border-b">
						<h2 className="text-xl font-semibold mb-3">Export Timeline</h2>
						<button
							onClick={onClose}
							className="text-2xl leading-none hover:opacity-70 transition-opacity cursor-pointer"
							aria-label="Close modal"
						>
							X
						</button>
					</div>

					<div className="flex gap-5 mt-10">
						{/* Export image button */}
						<button
							onClick={() => handleTimelineExport(exportTimelineImage)}
							disabled={isExportingTimeline}
							className="dark:border-white border-black border p-2 text-md cursor-pointer mb-10"
						>
							Export as Image
						</button>

						<button
							onClick={() => handleTimelineExport(exportTimelineHtml)}
							disabled={isExportingTimeline}
							className="dark:border-white border-black border p-2 text-md cursor-pointer mb-10"
						>
							Export as HTML
						</button>
					</div>

					{errorMessage && (
						<h2 className="className=text-md font-semibold">{errorMessage}</h2>
					)}
				</div>
			</div>
		</>
	);
}
