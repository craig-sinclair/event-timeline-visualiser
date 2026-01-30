"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getAllTimelines } from "@/lib/api/getAllTimelines";
import { TimelineData } from "@/models/timeline";

export default function TimelinesTable() {
	const [timelines, setTimelines] = useState<TimelineData[]>([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchTimelines();
	}, []);

	const fetchTimelines = async () => {
		try {
			setLoading(true);
			const data = await getAllTimelines();
			setTimelines(data);
		} catch (error) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage("Unknown error occurred :/");
			}
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <LoadingSpinner />;
	}

	if (errorMessage) {
		return (
			<div className="flex justify-center items-center py-4">
				<h2 className="font-xl">Sorry, an error while fetching timelines from database.</h2>
				<h2>Details: {errorMessage}</h2>
			</div>
		);
	}

	return (
		<div className="relative overflow-x-auto shadow-md rounded-sm md:w-3/5 w-full mt-3">
			<table className="w-full text-md text-center rtl:text-right text-gray-900 dark:text-gray-300">
				<thead className="text-lg text-gray-700 dark:text-gray-200 bg-[var(--lightSecondary)]">
					<tr className="border-b border-[var(--borderColour)]">
						<th className="py-6 w-1/2 border-r border-[var(--borderColour)]">Title</th>
						<th className="py-6 w-1/4 text-center border-r border-[var(--borderColour)]">
							Events
						</th>
						<th className="py-6 w-1/4 text-center border-l border-[var(--borderColour)]">
							Action
						</th>
					</tr>
				</thead>

				<tbody>
					{timelines.map((timeline) => (
						<tr
							key={timeline._id}
							className="text-md bg-[var(--darkSecondary)] border-b border-[var(--borderColour)] transition-colors"
						>
							<td className="py-8 text-gray-900 dark:text-gray-200 border-r border-[var(--borderColour)]">
								{timeline.title}
							</td>
							<td className="py-8 text-gray-700 dark:text-gray-300 text-center border-r border-[var(--borderColour)]">
								{timeline.events.length}
							</td>
							<td className="py-8 border-l border-[var(--borderColour)] text-center">
								<Link
									className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors cursor-pointer"
									href={`/timeline/${timeline._id}`}
								>
									View
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
