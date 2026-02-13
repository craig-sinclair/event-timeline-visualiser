import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Page() {
	return (
		<section className="flex flex-col items-center justify-center md:flex-row gap-6 min-h-[calc(100vh-20rem)]">
			<div className="flex flex-col justify-center items-center gap-6 rounded-lg p-4 sm:px-6 sm:py-6 md:px-10">
				<p className="text-2xl sm:text-3xl md:text-4xl md:leading-normal font-light text-center">
					Welcome to{" "}

					<span className="font-serif font-bold text-4xl tracking-tight text-gray-900 dark:text-gray-100">
						TimelineScope
					</span>
					<span className="text-blue-900 dark:text-blue-500 font-light text-4xl">.</span>
				<br />
					Explore a variety of social, political and economic event timelines.
				</p>

				<Link
					href="/dashboard"
					className="flex items-center justify-center gap-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:px-6 sm:py-3 sm:gap-5 md:text-base"
					aria-label="Log in to the dashboard"
				>
					<span>Get Started</span>
					<ArrowRightIcon className="w-5 md:w-6" />
				</Link>
			</div>
		</section>
	);
}
