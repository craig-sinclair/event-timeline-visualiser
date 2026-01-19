"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

import { getTopicHierarchy } from "@/lib/api/getTopicHierarchy";
import { TopicHierarchyData } from "@/models/ontology";

export default function TopicHierarchyText({ topicID }: { topicID: string }) {
	const [hierarchyData, setHierarchyData] = useState<TopicHierarchyData>();
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [loading, setLoading] = useState(false);

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
			}
		};
		fetchEventHierarchy();
	}, [topicID]);

	if (loading) {
		return (
			// Loading spinner animation
			<div className="flex justify-center items-center py-4">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
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
		<div className="flex gap-3 max-w-4xl mx-auto px-4 sm:px-6 mt-5 sm:mt-10">
			{hierarchyData?.hierarchy.map((topic, i) => {
				return (
					<div className="flex align-center justify-center gap-2">
						<Link href={`/events-in-topic/${topic.qcode}`} key={i}>
							<button className="text-md font-medium cursor-pointer p-2 bg-green-600 dark:bg-green-800 text-white rounded-md hover:opacity-80">
								{topic?.prefLabel}
							</button>
						</Link>

						<h1 className="text-md font-medium py-2 px-1">/</h1>
					</div>
				);
			})}

			<button className="text-md font-medium cursor-pointer p-2 rounded-md bg-blue-600 dark:bg-blue-900 text-white hover:opacity-80">
				{hierarchyData?.prefLabel}
			</button>
		</div>
	);
}
