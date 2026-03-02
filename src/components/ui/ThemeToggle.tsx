"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const isDark = theme === "dark";

	return (
		<button
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="relative h-6 w-12 md:h-7 md:w-14 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200 ease-in-out cursor-pointer"
			aria-label="Toggle theme"
		>
			<div
				className={`absolute top-0.5 h-5 w-5 md:h-6 md:w-6 rounded-full bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
					isDark ? "translate-x-7" : "translate-x-0.5"
				}`}
			>
				<div className="transition-transform duration-200 ease-in-out">
					{isDark ? (
						<svg
							className="h-3 md:h-3.5 w-3 md:w-3.5 text-gray-100 rotate-0 transition-transform duration-200"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
						</svg>
					) : (
						<svg
							className="h-3 md:h-3.5 w-3 text-gray-800 rotate-0 transition-transform duration-200"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
								clipRule="evenodd"
							/>
						</svg>
					)}
				</div>
			</div>
		</button>
	);
}
