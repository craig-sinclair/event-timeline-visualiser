import { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,

	// Only include experimental settings if needed
	experimental: {
		turbo: {}, // Empty object instead of boolean to satisfy Turbopack
	},

	// This ensures Next.js knows the correct root if multiple lockfiles exist
	outputFileTracingRoot: __dirname, // your dashboard folder path

	// Optionally, you can disable Turbopack if you prefer SWC
	// experimental: {
	//   turbo: false,
	// },

	// Future-proofing: Next.js recommended settings
	swcMinify: true,
};

export default nextConfig;
