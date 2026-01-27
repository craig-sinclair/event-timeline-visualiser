"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import { getTopicHierarchy } from "@/lib/api/getTopicHierarchy";
import { TopicHierarchyData, TopicHierarchyTextSize } from "@/models/ontology.types";

export default function TopicHierarchyText({
	topicID,
	size = TopicHierarchyTextSize.Standard,
	onLoadComplete,
}: {
	topicID: string;
	size?: TopicHierarchyTextSize;
	onLoadComplete?: () => void;
}) {
	const [hierarchyData, setHierarchyData] = useState<TopicHierarchyData>();
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [loading, setLoading] = useState(false);

	const small = size === TopicHierarchyTextSize.Small;

	useEffect(() => {
		const fetchEventHierarchy = async () => {
			try {
				setLoading(true);
				const response = await getTopicHierarchy({ topicID: topicID });

				if (!response.prefLabel || !response.hierarchy || !response.qcode) {
					throw new Error("Could not find any hierarchy data for this topic");
				}
				setHierarchyData(response);
			} catch (err) {
				setErrorMessage(
					err instanceof Error ? err.message : "Unknown error whilst fetching data"
				);
			} finally {
				setLoading(false);
				onLoadComplete?.(); // notify parent (event modal) that completed loading
			}
		};
		fetchEventHierarchy();
	}, [topicID, onLoadComplete]);

	if (loading) {
		return (
			<div className="flex justify-center items-center py-4">
				<div
					className={
						(small ? "h-6 w-6 border-2 " : "h-8 w-8 border-4 ") +
						"animate-spin rounded-full border-blue-500 border-t-transparent"
					}
				></div>
			</div>
		);
	}

	if (errorMessage) {
		return (
			<div className="flex justify-center max-w-4xl mx-auto px-4 sm:px-6 mt-5 sm:mt-10">
				<h1 className="text-lg font-medium">{errorMessage}...</h1>
			</div>
		);
	}

	return (
		<div className={"flex gap-3" + (small ? "flex-wrap mt-4" : "")}>
			{hierarchyData?.hierarchy.map((topic, i) => {
				return (
					<div className="flex align-center justify-center gap-2" key={i}>
						<Link href={`/events-in-topic/${topic.qcode}`}>
							<button
								className={
									"font-medium cursor-pointer rounded-md text-white hover:opacity-80 " +
									(small
										? "text-xs px-2 py-1 bg-green-600 dark:bg-green-800"
										: "text-md p-2 bg-green-600 dark:bg-green-800")
								}
							>
								{topic?.prefLabel}
							</button>
						</Link>

						<h1
							className={
								small
									? "text-sm font-medium py-1 mr-1 px-1"
									: "text-md font-medium py-2 px-1"
							}
						>
							/
						</h1>
					</div>
				);
			})}

			{small ? (
				<Link href={`/events-in-topic/${hierarchyData?.qcode}`}>
					<button className="font-medium cursor-pointer rounded-md text-white hover:opacity-80 text-xs px-2 py-1 bg-blue-600 dark:bg-blue-900">
						{hierarchyData?.prefLabel}
					</button>
				</Link>
			) : (
				<button className="font-medium cursor-pointer rounded-md text-white hover:opacity-80 text-md p-2 bg-blue-600 dark:bg-blue-900">
					{hierarchyData?.prefLabel}
				</button>
			)}
		</div>
	);
}
