"use client";

import TopicHierarchyText from "@/components/ui/TopicHierarchyText";
import { EventData } from "@/models/event";
import { TopicHierarchyTextSize } from "@/models/ontology.types";

export default function EventModal({
	visible,
	event,
	onClose,
}: {
	visible: boolean;
	event: EventData | null;
	onClose: () => void;
}) {
	if (!visible || !event) {
		return null;
	}

	return (
		<>
			{/* Backdrop */}
			<div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="bg-[var(--background)] border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
					{/* Header */}
					<div className="flex justify-between items-start p-6 border-b">
						<h2 className="text-xl font-semibold pr-8">{event.overview}</h2>
						<button
							onClick={onClose}
							className="text-2xl leading-none hover:opacity-70 transition-opacity cursor-pointer"
							aria-label="Close modal"
						>
							X
						</button>
					</div>

					{/* Content */}
					<div className="p-6 space-y-4">
						{/* Date & Time */}
						<div>
							<h3 className="text-sm font-semibold mb-1">Date & Time</h3>
							<p className="text-sm opacity-80">
								{new Date(event.dateTime).toLocaleString()}
							</p>
						</div>

						{/* Relevance */}
						<div>
							<h3 className="text-sm font-semibold mb-1">Relevance</h3>
							<p className="text-sm opacity-80">{event.relevance}</p>
						</div>

						<div>
							<h3 className="text-sm font-semibold mb-1">Further information</h3>
							<p className="text-sm opacity-80">{event.furtherDescription}</p>
						</div>

						{/* Related tags: for linking event with another timeline */}
						{event.tags?.length > 0 && (
							<div>
								<h3 className="text-sm font-semibold mb-2">Related Timelines</h3>
								<div className="flex flex-wrap gap-2">
									{event.tags.map((tag, index) => (
										<span
											key={index}
											className="px-3 py-1 text-xs border rounded-full"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						)}

						{/* Ontology topics */}
						{event?.qcode && event.qcode.length > 0 && (
							<div>
								<h3 className="text-sm font-semibold mb-2">Tags:</h3>
								<div>
									{event.qcode.map((topicID, index) => (
										<TopicHierarchyText
											size={TopicHierarchyTextSize.Small}
											key={index}
											topicID={topicID}
										/>
									))}
								</div>
							</div>
						)}

						{/* URLs */}
						{event.URLs?.length > 0 && (
							<div>
								<h3 className="text-sm font-semibold mb-2">Related Links</h3>
								<ul className="space-y-1">
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
