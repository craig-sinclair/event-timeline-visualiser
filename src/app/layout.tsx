import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import ErrorBoundary from "@/app/components/layout/ErrorBoundary";
import { inter } from "@/app/components/ui/fonts";
import NavbarWrapper from "@/app/components/ui/navbar-wrapper";
import Providers from "@/app/providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Event Timeline Visualiser",
	description: "created by Craig Sinclair",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
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
