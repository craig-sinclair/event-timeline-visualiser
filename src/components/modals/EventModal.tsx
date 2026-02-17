"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TopicHierarchyText from "@/components/ui/TopicHierarchyText";
import { getEventTagsToTimelineMap } from "@/lib/api/getEventTagsToTimelineMap";
import { EventData } from "@/models/event";
import { TopicHierarchyTextSize } from "@/models/ontology.types";
import { TagToTimelineMap } from "@/models/timeline";

export default function EventModal({
	visible,
	event,
	onClose,
}: {
	visible: boolean;
	event: EventData | null;
	onClose: () => void;
}) {
	// Use a loading state until all topic hierarchy texts are loaded
	const [loadedTopicHierarchies, setLoadedTopicHierarchies] = useState<number>(0);
	const totalTopics = event?.qcode?.length || 0;
	const isLoading = totalTopics > 0 && loadedTopicHierarchies < totalTopics;

	const [tagsToTimelineMap, setTagsToTimelineMap] = useState<TagToTimelineMap>({});
	const [tagsMappingError, setTagsMappingError] = useState<string>("");

	// Rest loaded topic hierarchies count when event changes
	useEffect(() => {
		const fetchTagsToTimelines = async () => {
			if (event?.tags && event?.tags?.length > 0) {
				try {
					const tagTimelineMap: TagToTimelineMap = await getEventTagsToTimelineMap({
						allTagsArray: event.tags,
					});
					setTagsToTimelineMap(tagTimelineMap);
					setTagsMappingError("");
				} catch (error) {
					setTagsToTimelineMap({});
					if (error instanceof Error) {
						setTagsMappingError(error.message);
					} else {
						setTagsMappingError(
							"An unknown error occurred whilst fetching timeline mappings."
						);
					}
				}
			}
		};
		fetchTagsToTimelines();
		setLoadedTopicHierarchies(0);
	}, [event]);

	const handleHierarchyTextLoaded = useCallback(() => {
		setLoadedTopicHierarchies((prev) => prev + 1);
	}, []);

	if (!visible || !event) {
		return null;
	}

	const formattedDate = new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(event.dateTime));

	const relevancePct = Math.round(event.relevance * 100);

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="bg-[var(--background)] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
					{/* Header */}
					<div className="relative bg-gradient-to-br from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 px-4 py-4 md:px-6 md:py-5">
						{" "}
						<p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
							{formattedDate}
						</p>
						<h2 className="text-lg md:text-xl font-semibold text-white leading-snug pr-8">
							{event.overview}
						</h2>
						<button
							onClick={onClose}
							className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer text-xl leading-none"
							aria-label="Close modal"
						>
							✕
						</button>
					</div>

					{isLoading && <LoadingSpinner />}

					<div
						className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
					>
						{/* Content */}
						<div className="px-6 py-5 space-y-6">
							{/* Description */}
							{event.furtherDescription && (
								<p className="text-sm leading-relaxed opacity-75">
									{event.furtherDescription}
								</p>
							)}

							{/* Relevance */}
							<div>
								<div className="flex justify-between items-center mb-1.5">
									<span className="text-xs font-semibold uppercase tracking-wider opacity-50">
										Relevance:
									</span>
									<span className="text-xs font-semibold tabular-nums">
										{relevancePct}%
									</span>
								</div>
								<div className="h-1.5 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
									<div
										className="h-full rounded-full bg-blue-500"
										style={{ width: `${relevancePct}%` }}
									/>
								</div>
							</div>

							{/* Divider */}
							<hr className="border-black/8 dark:border-white/8" />

							{/* Related tags: for linking event with another timeline */}
							{event.tags?.length > 0 && !tagsMappingError && (
								<div>
									<p className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-2.5">
										Related Timelines:
									</p>
									<div className="flex flex-wrap gap-2">
										{event.tags.map((tag, index) => {
											const timelineId = tagsToTimelineMap?.[tag];
											return timelineId ? (
												<Link
													key={index}
													href={`/timeline/${timelineId}`}
													className="px-2.5 py-1 text-xs font-medium rounded-full border hover:underline hover:opacity-60"
												>
													{tag}
												</Link>
											) : (
												<span
													key={index}
													className="px-2.5 py-1 text-xs font-medium rounded-full border opacity-40"
												>
													{tag}
												</span>
											);
										})}
									</div>
								</div>
							)}

							{/* Ontology topics */}
							{event?.qcode && event.qcode.length > 0 && (
								<div>
									<p className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-2.5">
										Media Topics:
									</p>
									<div className="space-y-2">
										{event.qcode.map((topicID, index) => (
											<TopicHierarchyText
												size={TopicHierarchyTextSize.Small}
												key={topicID ?? index}
												topicID={topicID}
												onLoadComplete={handleHierarchyTextLoaded}
											/>
										))}
									</div>
								</div>
							)}

							{/* Source Links */}
							{event.URLs?.length > 0 && (
								<div>
									<p className="text-xs font-semibold uppercase tracking-wider opacity-50 mb-2.5">
										Sources:
									</p>
									<ul className="space-y-1.5">
										{event.URLs.map((url, index) => (
											<li key={index} className="flex items-start gap-2">
												<span className="mt-0.5 text-blue-500 shrink-0">
													↗
												</span>
												<a
													href={url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm text-blue-500 hover:underline break-all leading-snug"
												>
													{url}
												</a>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
