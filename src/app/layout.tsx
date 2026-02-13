import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Providers from "@/app/providers";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { inter } from "@/components/ui/fonts";
import NavbarWrapper from "@/components/ui/navbar-wrapper";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "TimelineScope",
	description: "Created by Craig Sinclair",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
			>
				<Providers>
					<NavbarWrapper />
					<ErrorBoundary>
						<div className="flex flex-col md:flex-row">
							<main className="flex-1 p-4 sm:p-6">{children}</main>
						</div>
					</ErrorBoundary>
				</Providers>
			</body>
		</html>
	);
}
