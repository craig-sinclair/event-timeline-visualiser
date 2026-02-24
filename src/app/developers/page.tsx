import fs from "fs";
import path from "path";

import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import "./page.module.css";

export default function DevelopersPage() {
	const filePath = path.join(process.cwd(), "content", "docs.md");
	const markdown = fs.readFileSync(filePath, "utf8");

	return (
		<div className="max-w-4xl mx-auto">
			<article className="docs-article">
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
