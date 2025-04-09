"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const { status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-blue-100">
            Wanderlust Travel
          </Link>

          <nav className="flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-100">
              Home
            </Link>
            <Link href="/search" className="hover:text-blue-100">
              Search
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="hover:text-blue-100">
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md border border-white hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
