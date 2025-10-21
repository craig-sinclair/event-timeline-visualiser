"use client";
import { useEffect, useState } from "react";
import { TimelineData } from "@/app/models/timeline";
import { getAllTimelines } from "@/app/lib/api/getAllTimelines";
import Link from "next/link"

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
        }
        catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            }
            else {
                setErrorMessage("Unknown error occurred :/");
            }
        }
        finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            // Loading spinner animation
            <div className="flex justify-center items-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    };

    if(errorMessage) {
        return (
            <div className="flex justify-center items-center py-4">
                <h2 className="font-xl">Sorry, an error while fetching timelines from database.</h2>
                <h2>Details: {errorMessage}</h2>
            </div>
        );
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg md:w-1/2 w-3/4 bg-white dark:bg-gray-900">
            <table className="w-full text-md text-left rtl:text-right text-gray-900 dark:text-gray-300">
                <thead className="text-md text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-800/80">
                    <tr>
                        <th className="px-6 py-3 w-1/2">Title</th>
                        <th className="px-6 py-3 w-1/4 text-center">Events</th>
                        <th className="px-6 py-3 w-1/4 text-center">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {timelines.map((timeline) => (
                        <tr
                            key={timeline._id}
                            className="text-sm odd:bg-gray-100 even:bg-gray-50 dark:odd:bg-gray-900/40 dark:even:bg-gray-800/30 border-b border-gray-300 dark:border-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <td className="px-6 py-4 text-gray-900 dark:text-gray-200">{timeline.title}</td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300 text-center">{timeline.events.length}</td>
                            <td className="px-6 py-4 text-center">
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