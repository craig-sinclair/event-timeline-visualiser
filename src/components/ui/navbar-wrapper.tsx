"use client";

import { useSession, signOut } from "next-auth/react";

import Navbar from "@/components/ui/navbar";

export default function NavbarWrapper() {
	const { data: session } = useSession();
	const isSignedIn = !!session;

	return (
		<Navbar
			title="Interactive Event Timeline Visualiser"
			isSignedIn={isSignedIn}
			onSignOut={() => signOut({ callbackUrl: "/" })}
		/>
	);
}
