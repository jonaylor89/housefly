"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { fetchGraphQL } from "@/lib/graphql-client";

type Challenge = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
};

type ChallengeConnection = {
  edges: {
    cursor: string;
    node: Challenge;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
};

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedChallenges = async () => {
      try {
        const result = await fetchGraphQL(`
          query FeaturedChallenges {
            challenges(first: 6) {
              edges {
                cursor
                node {
                  id
                  title
                  difficulty
                  category
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `);

        setChallenges(result.challenges.edges.map((edge: any) => edge.node));
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedChallenges();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#282828] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">GraphQL Developer Hub</h1>
          </div>
          <nav>
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white"
                >
                  Dashboard
                </Link>
                <Link
                  href="/challenges"
                  className="text-gray-300 hover:text-white"
                >
                  Challenges
                </Link>
                <span className="text-gray-300">Welcome, {user.name}</span>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <section className="mb-10">
          <div className="text-center py-16 bg-gradient-to-r from-[#f3f4f5] to-[#f7f7f7] dark:from-[#282828] dark:to-[#2c2c2c] rounded-lg mb-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">
              Master Coding Challenges with GraphQL
            </h2>
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Practice your coding skills and learn GraphQL while solving
              developer challenges
            </p>
            <Link href="/challenges" className="btn-primary hover:shadow-md">
              Explore Challenges
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Featured Challenges</h2>
          {loading ? (
            <p>Loading challenges...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="card hover:shadow-md transition-all duration-200 hover:border-[#3c8ffe]/20"
                >
                  <div>
                    <h3 className="text-lg font-semibold mb-2 tracking-tight">
                      {challenge.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`badge badge-${challenge.difficulty}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="badge badge-category">
                        {challenge.category}
                      </span>
                    </div>
                    <Link
                      href={`/challenges/${challenge.id}`}
                      className="text-[#3c8ffe] hover:text-[#265f96] font-medium inline-flex items-center"
                    >
                      View Challenge
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 text-center">
            <Link
              href="/challenges"
              className="text-blue-600 hover:text-blue-800"
            >
              View All Challenges →
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#f3f4f5] dark:bg-[#282828] p-5 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto text-center">
          <p className="text-gray-700 dark:text-gray-300">
            GraphQL Developer Hub - A demo site for learning web scraping
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            This is a simplified example with an in-memory GraphQL API
          </p>
        </div>
      </footer>
    </div>
  );
}
