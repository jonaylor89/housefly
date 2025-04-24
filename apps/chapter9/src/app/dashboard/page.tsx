"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { fetchGraphQL } from "@/lib/graphql-client";

type Challenge = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
};

export default function Dashboard() {
  const router = useRouter();
  const { user, token, isLoading: authLoading, logout } = useAuth();
  const [bookmarkedChallenges, setBookmarkedChallenges] = useState<Challenge[]>(
    [],
  );
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && token) {
      const fetchUserData = async () => {
        try {
          const data = await fetchGraphQL(
            `
            query GetUserData {
              me {
                id
                name
                bookmarks {
                  id
                  title
                  difficulty
                  category
                }
                completedChallenges {
                  id
                  title
                  difficulty
                  category
                }
              }
            }
            `,
            {},
            token,
          );

          if (data.me) {
            setBookmarkedChallenges(data.me.bookmarks);
            setCompletedChallenges(data.me.completedChallenges);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [user, token, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-blue-800 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">GraphQL Developer Hub</h1>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#282828] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            GraphQL Developer Hub
          </Link>
          <nav>
            <div className="flex items-center gap-4">
              <Link href="/challenges" className="text-gray-300 hover:text-white">
                Challenges
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
              <span className="text-gray-300">Welcome, {user?.name}</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="card">
            <h2 className="text-lg font-semibold mb-4">
              Bookmarked Challenges
            </h2>
            {bookmarkedChallenges.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                You haven't bookmarked any challenges yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {bookmarkedChallenges.map((challenge) => (
                  <li
                    key={challenge.id}
                    className="border-b border-gray-200 dark:border-gray-700 pb-3"
                  >
                    <Link
                      href={`/challenges/${challenge.id}`}
                      className="hover:text-[#3c8ffe]"
                    >
                      <h3 className="font-medium text-sm">{challenge.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className={`badge badge-${challenge.difficulty}`}>
                          {challenge.difficulty}
                        </span>
                        <span className="badge badge-category">
                          {challenge.category}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <h2 className="text-lg font-semibold mb-4">Completed Challenges</h2>
            {completedChallenges.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                You haven't completed any challenges yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {completedChallenges.map((challenge) => (
                  <li
                    key={challenge.id}
                    className="border-b border-gray-200 dark:border-gray-700 pb-3"
                  >
                    <Link
                      href={`/challenges/${challenge.id}`}
                      className="hover:text-[#3c8ffe]"
                    >
                      <h3 className="font-medium text-sm">{challenge.title}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className={`badge badge-${challenge.difficulty}`}>
                          {challenge.difficulty}
                        </span>
                        <span className="badge badge-category">
                          {challenge.category}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="mt-8">
          <Link href="/challenges" className="btn-primary">
            Browse More Challenges
          </Link>
        </div>
      </main>

      <footer className="bg-[#f3f4f5] dark:bg-[#282828] p-5 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-gray-700 dark:text-gray-300">GraphQL Developer Hub - A demo site for learning web scraping</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            This is a simplified example with an in-memory GraphQL API
          </p>
        </div>
      </footer>
    </div>
  );
}
