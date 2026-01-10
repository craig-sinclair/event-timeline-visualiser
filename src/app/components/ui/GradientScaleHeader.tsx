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
				<span className="text-xs sm:text-lg md:text-xl font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-sm bg-red-900/30 text-red-400">
					{leftLabel}
				</span>
				<span className="text-xs sm:text-lg md:text-xl font-semiboldpx-3 sm:px-4 py-1 sm:py-2 rounded-sm bg-green-900/30 text-green-400">
					{rightLabel}
				</span>
			</div>

			<div className="h-2 rounded-full bg-gradient-to-r from-red-600 via-yellow-500 to-green-600 opacity-40" />
		</div>
	);
}
