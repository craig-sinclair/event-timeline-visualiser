"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

import ThemeToggle from "@/components/ui/ThemeToggle";
import { NavLink } from "@/models/nav.types";

const navLinks: NavLink[] = [
	{ href: "/developers", label: "Developers", authRequired: true },
	{ href: "/", label: "About", authRequired: false },
	{ href: "/dashboard", label: "All Timelines", authRequired: false },
];

interface HeaderProps {
	title: string;
	isSignedIn: boolean;
	onSignOut: () => void;
}

export default function Navbar({ title, isSignedIn, onSignOut }: HeaderProps) {
	const { data: session } = useSession();
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
	const pathname = usePathname();

	const userInitials = session?.user?.displayName
		? session.user.displayName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
		: "U";

	return (
		<header className="grid grid-cols-3 items-center p-4 border-b border-[var(--borderColour)]">
			<div className="flex items-center">
				<Link href={"/"}>
					<div className="hover:opacity-75 transition-all duration-200 m-0 p-0">
						<span className="font-serif font-bold text-2xl tracking-tight text-gray-900 dark:text-gray-100">
							{title}
						</span>
						<span className="text-blue-900 dark:text-blue-500 font-light text-2xl">
							.
						</span>
					</div>
				</Link>
			</div>

			<div className="flex justify-center">
				<nav className="hidden md:flex items-center gap-1 md:gap-3 lg:gap-4 border border-[var(--borderColour)] rounded-full px-2 py-1">
					{navLinks
						.filter((link) => !link.authRequired || isSignedIn)
						.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={`text-sm font-medium px-4 py-1.5 rounded-full
									${
										pathname === link.href
											? "text-gray-900 dark:text-white bg-gray-100 dark:bg-[var(--darkSecondary)]"
											: "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[var(--darkSecondary)] transition-all duration-150"
									}`}
							>
								{link.label}
							</Link>
						))}
				</nav>
			</div>

			<div className="flex items-center justify-end gap-2">
				<ThemeToggle />

				{isSignedIn ? (
					<div className="relative">
						<button
							onClick={toggleDropdown}
							className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 ml-1 md:ml-3 text-white flex items-center justify-center font-semibold font-serif cursor-pointer"
						>
							{userInitials}
						</button>

						{dropdownOpen && (
							<div className="absolute right-0 mt-2 w-40 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 bg-white dark:bg-gray-900">
								<button
									onClick={onSignOut}
									className="block w-full text-left px-2 py-1 md:px-4 md:py-2 rounded-md text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-150"
								>
									Sign Out
								</button>
							</div>
						)}
					</div>
				) : (
					// Not yet signed in; display 'Sign In' button
					<Link href={"/signin"}>
						<button className="rounded bg-blue-600 px-1 md:px-3 py-1 text-sm md:text-base text-white hover:bg-blue-700 cursor-pointer">
							Sign In
						</button>
					</Link>
				)}
			</div>
		</header>
	);
}
