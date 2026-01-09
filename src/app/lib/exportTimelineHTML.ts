export const exportTimelineHtml = async (timelineRef: HTMLDivElement | null): Promise<void> => {
	if (!timelineRef) return;

	try {
		const clone = timelineRef.cloneNode(true) as HTMLElement;

		const html = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <script src="https://cdn.tailwindcss.com"></script>
                <script>
                    tailwind.config = {
                        darkMode: 'class'
                    }
                </script>

                <style>
                    .export-mode,
                    .export-mode * {
                        color: #000000 !important;
                        background-color: #ffffff !important;
                        border-color: #000000 !important;
                        opacity: 1 !important;
                        font-family: Arial, Helvetica, sans-serif;
                    }

                    @media (prefers-color-scheme: dark) {
                        .export-mode,
                        .export-mode * {
                            color: #ffffff !important;
                            background-color: #0a0a0a !important;
                            border-color: #ffffff !important;
                        }
                    }
                </style>
            </head>
            <body class="export-mode">
                ${clone.outerHTML}
            </body>
        </html>
        `;

		const blob = new Blob([html], { type: "text/html" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `timeline-${new Date().toISOString().slice(0, 10)}.html`;
		link.click();

		URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Failed to export timeline", error);
		throw error;
	}
};
