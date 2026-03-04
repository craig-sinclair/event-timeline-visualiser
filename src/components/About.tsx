"use client";

import {
	AdjustmentsHorizontalIcon,
	ArrowRightIcon,
	BookOpenIcon,
	FunnelIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const steps = [
	{
		number: "01",
		icon: MagnifyingGlassIcon,
		title: "Browse Timelines",
		description:
			"Open the full timeline collection and explore topics spanning politics, economics, and culture.",
		cta: null,
	},
	{
		number: "02",
		icon: BookOpenIcon,
		title: "Select a Timeline",
		description:
			"Choose any timeline to enter a full chronological view of every major event, laid out clearly in sequence.",
		cta: null,
	},
	{
		number: "03",
		icon: FunnelIcon,
		title: "Filter and Sort",
		description: "Narrow down by date range, event relevance, or media topics of interest.",
		cta: null,
	},
	{
		number: "04",
		icon: AdjustmentsHorizontalIcon,
		title: "Explore Event Details",
		description:
			"Click any event to read its full details and follow direct links to original source articles and references.",
		cta: null,
	},
];

function useInView(threshold = 0.15) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [threshold]);
	return { ref, visible };
}

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
	const { ref, visible } = useInView(0.1);
	const Icon = step.icon;

	return (
		<div
			ref={ref}
			style={{
				transitionDelay: `${index * 120}ms`,
				opacity: visible ? 1 : 0,
				transform: visible ? "translateY(0)" : "translateY(32px)",
				transition: "opacity 0.65s ease, transform 0.65s ease",
			}}
			className="group relative flex flex-col gap-5 rounded-2xl border border-[var(--borderColour)] bg-[var(--lightSecondary)] p-7"
		>
			<span className="absolute top-5 right-6 font-serif text-6xl font-bold text-[var(--foreground)] opacity-[0.04] select-none pointer-events-none">
				{step.number}
			</span>

			{/* Icon */}
			<div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--borderColour)] bg-[var(--background)] text-blue-600">
				<Icon className="h-5 w-5" />
			</div>

			{/* Step label */}
			<div className="flex items-center gap-2">
				<span className="text-[10px] font-bold uppercase tracking-widest text-blue-600/70">
					Step {step.number}
				</span>
			</div>

			<div className="flex flex-col gap-2">
				<h3 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
					{step.title}
				</h3>
				<p className="text-sm leading-relaxed text-[var(--foreground)] opacity-55">
					{step.description}
				</p>
			</div>
		</div>
	);
}

export default function About() {
	const { ref: heroRef, visible: heroVisible } = useInView(0.1);
	const { ref: stepsLabelRef, visible: stepsLabelVisible } = useInView(0.2);

	return (
		<section id="about" className="w-full px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-6xl">
				<div
					ref={heroRef}
					style={{
						opacity: heroVisible ? 1 : 0,
						transform: heroVisible ? "translateY(0)" : "translateY(24px)",
						transition: "opacity 0.7s ease, transform 0.7s ease",
					}}
					className="mb-24 grid gap-12 md:grid-cols-2 md:gap-20 items-center"
				>
					<div className="flex flex-col gap-6">
						<span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
							About TimelineScope
						</span>
						<h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
							See what happened,{" "}
							<span className="italic font-light">and why it mattered.</span>
						</h2>
						<p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
							TimelineScope turns historical complexity into navigable, visual
							stories: from political revolutions to economic turning points, every
							event is placed in its proper context.
						</p>
						<p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">
							Built for students, researchers, and the simply curious. Our goal is to
							make the full sweep of world history immediately accessible and
							genuinely intuitive.
						</p>
						<Link
							href="/dashboard"
							className="self-start flex items-center gap-3 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
						>
							<span>Explore Timelines</span>
							<ArrowRightIcon className="w-4 h-4" />
						</Link>
					</div>
				</div>

				<div
					ref={stepsLabelRef}
					style={{
						opacity: stepsLabelVisible ? 1 : 0,
						transform: stepsLabelVisible ? "translateY(0)" : "translateY(20px)",
						transition: "opacity 0.6s ease, transform 0.6s ease",
					}}
					className="mb-10"
				>
					<h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
						How it works
					</h3>
					<span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--foreground)] opacity-30">
						From catalogue to source in four easy steps.
					</span>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{steps.map((step, i) => (
						<StepCard key={step.number} step={step} index={i} />
					))}
				</div>

				<div
					style={{
						opacity: stepsLabelVisible ? 1 : 0,
						transition: "opacity 0.8s ease 0.5s",
					}}
					className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-[var(--borderColour)] bg-[var(--lightSecondary)] px-8 py-6"
				>
					<div>
						<p className="text-sm font-semibold text-[var(--foreground)]">
							Ready to begin?
						</p>
						<p className="text-sm text-[var(--foreground)] opacity-50">
							Free to use. No account required to browse.
						</p>
					</div>
					<Link
						href="/dashboard"
						className="shrink-0 flex items-center gap-3 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						<span>View All Timelines</span>
						<ArrowRightIcon className="w-4 h-4" />
					</Link>
				</div>
			</div>
		</section>
	);
}
