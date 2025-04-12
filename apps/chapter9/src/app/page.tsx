"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { fetchGraphQL } from '@/lib/graphql-client';

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
        console.error('Failed to fetch challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedChallenges();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">GraphQL Developer Hub</h1>
          <nav>
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <Link href="/challenges" className="hover:underline">
                  Challenges
                </Link>
                <span>Welcome, {user.name}</span>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" className="hover:underline">
                  Login
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <section className="mb-10">
          <div className="text-center py-16 bg-gray-50 rounded-lg mb-8">
            <h2 className="text-4xl font-bold mb-4">Master Coding Challenges with GraphQL</h2>
            <p className="text-xl mb-6">Practice your coding skills and learn GraphQL while solving developer challenges</p>
            <Link href="/challenges" className="btn-primary">
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
                <div key={challenge.id} className="card">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`badge badge-${challenge.difficulty}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="badge badge-category">
                        {challenge.category}
                      </span>
                    </div>
                    <Link href={`/challenges/${challenge.id}`} className="text-blue-600 hover:text-blue-800">
                      View Challenge →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 text-center">
            <Link href="/challenges" className="text-blue-600 hover:text-blue-800">
              View All Challenges →
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 p-6">
        <div className="container mx-auto text-center">
          <p>GraphQL Developer Hub - A demo site for learning web scraping</p>
          <p className="text-sm text-gray-600 mt-2">This is a simplified example with an in-memory GraphQL API</p>
        </div>
      </footer>
    </div>
  );
}
