export default function GradientScaleHeader({
	leftLabel,
	rightLabel,
}: {
	leftLabel: string;
	rightLabel: string;
}) {
	return (
		<div className="mb-12">
			<div className="flex justify-between items-center mb-4">
				<span
					className="
                        text-xs sm:text-lg md:text-xl font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-sm
                        dark:bg-red-900/30 dark:text-red-400
                        bg-red-100 text-red-800
                    "
				>
					{leftLabel}
				</span>
				<span
					className="
                        text-xs sm:text-lg md:text-xl font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-sm
                        dark:bg-green-900/30 dark:text-green-400
                        bg-green-100 text-green-800
                    "
				>
					{rightLabel}
				</span>
			</div>

			<div
				className="
                    h-2 rounded-full
                    dark:bg-gradient-to-r dark:from-red-600 dark:via-yellow-500 dark:to-green-600 dark:opacity-40
                    bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-70
                "
			/>
		</div>
	);
}
