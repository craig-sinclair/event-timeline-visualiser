export default function TimelineFilters() {
	return (
		<>
			<div>
				<label className="block mb-2 text-xs md:text-sm">Date Range</label>
				<input
					type="text"
					className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
					placeholder="All Time"
				/>
			</div>

			<div>
				<label className="block mb-2 text-xs md:text-sm">Tags</label>
				<input
					type="text"
					className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
					placeholder="View All"
				/>
			</div>

			<div>
				<label className="block mb-2 text-xs md:text-sm">Min. Relevance</label>
				<input
					type="text"
					className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
					placeholder="High"
				/>
			</div>

			<div>
				<label className="block mb-2 text-xs md:text-sm">Sort By</label>
				<input
					type="text"
					className="text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500 border border-[var(--borderColour)]"
					placeholder="Chronological"
				/>
			</div>
		</>
	);
}
