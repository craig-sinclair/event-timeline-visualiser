"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import VerticalTimeline from "@/app/components/VerticalTimeline";
import { getEventsInTopic } from "@/app/lib/api/getEventsInTopic";
import { EventsInTopic } from "@/app/models/ontology";

export default function EventsInTopicPage() {
	const { topicID } = useParams<{
		topicID: string;
	}>();

	const [allEventsInTopic, setAllEventsInTopic] = useState<EventsInTopic>([]);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchAllEvents = async () => {
			setLoading(true);
			try {
				const response = await getEventsInTopic({ topicID: topicID });
				console.log(response);
				setAllEventsInTopic(response);
			} catch (err) {
				setErrorMessage(
					err instanceof Error ? err.message : "Unknown error whilst fetching data"
				);
			} finally {
				setLoading(false);
			}
		};
		fetchAllEvents();
	}, [topicID]);

	if (loading) {
		return (
			// Loading spinner animation
			<div className="flex justify-center items-center py-4">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
			</div>
		);
	}

	if (errorMessage)
		return (
			<div className="flex min-h-[80vh] min-w-full justify-center items-center">
				<h1 className="text-3xl font-bold">{errorMessage}...</h1>
			</div>
		);

	return (
		<>
			<h1 className="text-3xl font-medium max-w-4xl mx-auto px-4 sm:px-6 underline">
				{topicID}
			</h1>
			{allEventsInTopic.map((timeline, i) => {
				return (
					<div key={i}>
						<div className="max-w-4xl mx-auto px-4 sm:px-6 mt-5 sm:mt-10">
							<Link href={`/timeline/${timeline.timelineId}`}>
								<h2 className="font-light text-xl cursor-pointer underline">
									{timeline.timelineName}
								</h2>
							</Link>
						</div>
						<VerticalTimeline
							events={timeline.events}
							leftLabel=""
							rightLabel=""
							exportVisible={false}
						/>
					</div>
				);
			})}
		</>
	);
}
