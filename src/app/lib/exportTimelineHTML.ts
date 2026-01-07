export const exportTimelineAsHtml = (timelineRef: HTMLDivElement | null): void => {
	if (!timelineRef) return;

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
            body {
                margin: 0;
                padding: 32px;
                background: #ffffff;
                font-family: Arial, Helvetica, sans-serif;
            }
        </style>
    </head>
    <body class="light">
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
};
