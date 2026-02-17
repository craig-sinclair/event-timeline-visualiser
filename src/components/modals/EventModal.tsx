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

	return (
		<>
			{/* Backdrop */}
			<div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="bg-[var(--background)] border rounded-md md:rounded-lg shadow-lg max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-x-hidden md:overflow-y-auto md:overflow-x-auto">
					{/* Header */}
					<div className="flex justify-between items-start p-3 md:p-6 border-b">
						<h2 className="text-md md:text-xl font-semibold pr-4 md:pr-8">
							{event.overview}
						</h2>
						<button
							onClick={onClose}
							className="text-xl md:text-2xl leading-none hover:opacity-70 transition-opacity cursor-pointer"
							aria-label="Close modal"
						>
							X
						</button>
					</div>

					{isLoading && <LoadingSpinner />}

					{/* Content */}
					<div
						className={`p-3 md:p-6 space-y-4 ${isLoading ? "opacity-0" : "opacity-100"}`}
					>
						{/* Date & Time */}
						<div>
							<h3 className="text-md font-semibold mb-1">Date & Time</h3>
							<p className="text-sm opacity-80">
								{new Date(event.dateTime).toISOString().split("T")[0]}
							</p>
						</div>

						<div>
							<h3 className="text-md font-semibold mb-1">Further information</h3>
							<p className="text-sm opacity-80">{event.furtherDescription}</p>
						</div>

						{/* Relevance */}
						<div>
							<h3 className="text-md font-semibold mb-1">Relevance</h3>
							<p className="text-sm opacity-80">{event.relevance * 100}%</p>
						</div>

						{tagsMappingError && (
							<div>
								<h3 className="text-sm font-semibold mb-2">{tagsMappingError}</h3>
							</div>
						)}

						{/* Related tags: for linking event with another timeline */}
						{event.tags?.length > 0 && !tagsMappingError && (
							<div>
								<h3 className="text-md font-semibold mb-2">Related Timelines</h3>
								<div className="flex flex-wrap gap-2">
									{event.tags.map((tag, index) => {
										const timelineId = tagsToTimelineMap?.[tag];

										return timelineId ? (
											<Link
												key={index}
												href={`/timeline/${timelineId}`}
												className="px-3 py-1 text-sm md:text-xs border rounded-md md:rounded-full hover:underline"
											>
												{tag}
											</Link>
										) : (
											<span
												key={index}
												className="px-3 py-1 text-sm md:text-xs border rounded-md md:rounded-full"
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
								<h3 className="text-md font-semibold mb-1">Tags:</h3>
								<div>
									{event.qcode.map((topicID, index) => (
										<TopicHierarchyText
											size={TopicHierarchyTextSize.Small}
											key={index}
											topicID={topicID}
											onLoadComplete={handleHierarchyTextLoaded}
										/>
									))}
								</div>
							</div>
						)}

						{/* URLs */}
						{event.URLs?.length > 0 && (
							<div>
								<h3 className="text-md font-semibold mb-1">Related Links</h3>
								<ul className="space-y-2 md:space-y-1">
									{event.URLs.map((url, index) => (
										<li key={index}>
											<a
												href={url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm text-blue-500 hover:underline break-all"
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
		</>
	);
}
