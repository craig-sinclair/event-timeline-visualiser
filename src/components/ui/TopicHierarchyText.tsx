"use client";

import Link from "next/link";
import { useState, useEffect, Fragment } from "react";

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

	const btnBase = "font-medium cursor-pointer rounded text-white hover:opacity-80 truncate";
	const btnSize = small ? "text-xs px-1.5 py-1" : "text-sm px-2 py-1.5";
	const separatorSize = small ? "text-xs" : "text-sm";

	return (
		<div className={`flex flex-wrap items-center gap-2 ${small ? "mt-4" : ""}`}>
			{hierarchyData?.hierarchy.map((topic, i) => (
				<Fragment key={topic.qcode}>
					<Link key={`link-${i}`} href={`/events-in-topic/${topic.qcode}`}>
						<button className={`${btnBase} ${btnSize} bg-green-600 dark:bg-green-800`}>
							{topic?.prefLabel}
						</button>
					</Link>
					<span
						key={`sep-${i}`}
						className={`${separatorSize} font-medium text-gray-400 select-none`}
					>
						/
					</span>
				</Fragment>
			))}

			<Link href={`/events-in-topic/${hierarchyData?.qcode}`}>
				<button className={`${btnBase} ${btnSize} bg-blue-600 dark:bg-blue-900`}>
					{hierarchyData?.prefLabel}
				</button>
			</Link>
		</div>
	);
}
