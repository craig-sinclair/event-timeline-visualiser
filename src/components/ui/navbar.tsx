"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

import ThemeToggle from "@/components/ui/ThemeToggle";

interface HeaderProps {
	title: string;
	isSignedIn: boolean;
	onSignOut: () => void;
}

export default function Navbar({ title, isSignedIn, onSignOut }: HeaderProps) {
	const { data: session } = useSession();
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

	const userInitials = session?.user?.name
		? session.user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
		: "U";

	return (
		<header className="flex justify-between items-center p-4 relative border-b border-[var(--borderColour)] dark:border-[var(--darkSecondary)]">
			<Link href={"/"}>
				<div className="hover:opacity-75 transition-all duration-200 m-0 p-0">
					<span className="font-serif font-bold text-2xl tracking-tight text-gray-900 dark:text-gray-100">
						{title}
					</span>
					<span className="text-blue-900 dark:text-blue-500 font-light text-2xl">.</span>
				</div>
			</Link>

			<div className="flex align-middle gap-2 items-center">
				<ThemeToggle />

				{isSignedIn ? (
					<div className="relative">
						<button
							onClick={toggleDropdown}
							className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold"
						>
							{userInitials}
						</button>

						{dropdownOpen && (
							<div className="absolute right-0 mt-2 w-40 border rounded shadow-lg z-10">
								<Link href={"/profile"}>
									<button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
										Profile
									</button>
								</Link>
								<button
									onClick={onSignOut}
									className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
								>
									Sign Out
								</button>
							</div>
						)}
					</div>
				) : (
					// Not yet signed in; display 'Sign In' button
					<Link href={"/signin"}>
						<button className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 cursor-pointer">
							Sign In
						</button>
					</Link>
				)}
			</div>
		</header>
	);
}
