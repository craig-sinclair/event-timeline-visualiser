"use client";

import { useSession, signOut } from "next-auth/react";
import Header from '@/app/components/ui/header';

export default function HeaderWrapper() {
  const { data: session } = useSession();
  const isSignedIn = !!session;

  return (
    <Header
      title="Interactive Event Timeline Visualiser"
      isSignedIn={isSignedIn}
      onSignOut={() => signOut({ callbackUrl: "/" })}
    />
  );
}
