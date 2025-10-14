'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  isSignedIn: boolean;
  onSignOut: () => void;
}

export default function Navbar({ title, isSignedIn, onSignOut }: HeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const userInitials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header className="flex justify-between items-center p-4 relative">
      <h1 className="text-xl font-bold">{title}</h1>

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
              <button
                onClick={() => router.push('/profile')}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </button>
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
        <button
          onClick={() => router.push('/signin')}
          className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 cursor-pointer"
        >
          Sign In
        </button>
      )}
    </header>
  );
}
