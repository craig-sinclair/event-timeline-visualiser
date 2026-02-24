import fs from "fs";
import path from "path";

import Link from "next/link";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

import styles from "./page.module.css";

const generalSections = [{ slug: "index", label: "Overview" }];
const endpointSections = [
	{ slug: "endpoints/fetch-timelines", label: "Get all Timelines" },
	{ slug: "endpoints/fetch-timeline", label: "Get Timeline by ID" },
	{ slug: "endpoints/fetch-events", label: "Get Events in Timeline" },
];

interface Props {
	searchParams: Promise<{ section?: string }>;
}

export default async function DevelopersPage({ searchParams }: Props) {
	const { section } = await searchParams;
	const activeSection = section ?? "index";

	const filePath = path.join(process.cwd(), "content", `${activeSection}.md`);
	const markdown = fs.readFileSync(filePath, "utf8");

	return (
		<div className="flex min-h-screen max-w-6xl mx-auto px-8 py-12 gap-12">
			{/* Sidebar */}
			<aside className="w-56 shrink-0">
				<div className="sticky top-8">
					<p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 px-3">
						API Reference
					</p>

					<div className="mb-4 border-b border-gray-200 dark:border-gray-700" />

					<nav className="flex flex-col gap-0.5">
						{generalSections.map((s) => (
							<Link
								key={s.slug}
								href={`/developers?section=${s.slug}`}
								className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
									activeSection === s.slug
										? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
										: "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 dark:hover:text-gray-200"
								}`}
							>
								{activeSection === s.slug && (
									<span className="w-1 h-1 rounded-full bg-blue-500 shrink-0" />
								)}
								{s.label}
							</Link>
						))}

						<p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 mt-4 mb-1">
							Endpoints
						</p>

						<div className="mb-4 border-b border-gray-200 dark:border-gray-700" />

						{endpointSections.map((s) => (
							<Link
								key={s.slug}
								href={`/developers?section=${s.slug}`}
								className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
									activeSection === s.slug
										? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
										: "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 dark:hover:text-gray-200"
								}`}
							>
								{activeSection === s.slug && (
									<span className="w-1 h-1 rounded-full bg-blue-500 shrink-0" />
								)}
								{s.label}
							</Link>
						))}
					</nav>
				</div>
			</aside>

			{/* Divider */}
			<div className="w-px bg-gray-200 dark:bg-gray-700 shrink-0" />

			{/* Content */}
			<article className={`flex-1 min-w-0 ${styles.docsArticle}`}>
				<Markdown
					remarkPlugins={[remarkGfm]}
					components={{
						code({ children, className, ...rest }) {
							const match = /language-(\w+)/.exec(className || "");
							if (match) {
								return (
									<SyntaxHighlighter language={match[1]} style={vscDarkPlus}>
										{String(children).replace(/\n$/, "")}
									</SyntaxHighlighter>
								);
							}
							return (
								<code className={className} {...rest}>
									{children}
								</code>
							);
						},
					}}
				>
					{markdown}
				</Markdown>
			</article>
		</div>
	);
}
