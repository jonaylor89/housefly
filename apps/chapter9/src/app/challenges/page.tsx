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

export default function Challenges() {
  const { user, token } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  const fetchChallenges = async (category: string | null = null, cursor: string | null = null) => {
    setLoading(true);
    try {
      const result = await fetchGraphQL(
        `
        query GetChallenges($category: String, $first: Int, $after: String) {
          challenges(category: $category, first: $first, after: $after) {
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
        `,
        {
          category: category,
          first: 9,
          after: cursor,
        },
        token
      );

      const data = result.challenges as ChallengeConnection;
      
      if (cursor) {
        // Append to existing challenges if loading more
        setChallenges(prev => [...prev, ...data.edges.map(edge => edge.node)]);
      } else {
        // Replace challenges if switching category
        setChallenges(data.edges.map(edge => edge.node));
      }
      
      setHasNextPage(data.pageInfo.hasNextPage);
      setEndCursor(data.pageInfo.endCursor);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges(activeCategory, null);
  }, [activeCategory]);

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
  };

  const handleLoadMore = () => {
    if (hasNextPage && endCursor) {
      fetchChallenges(activeCategory, endCursor);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            GraphQL Developer Hub
          </Link>
          <nav>
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <span>Welcome, {user.name}</span>
              </div>
            ) : (
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Coding Challenges</h1>
        
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`btn-filter ${!activeCategory ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Categories
            </button>
            <button
              onClick={() => handleCategoryChange('algorithms')}
              className={`btn-filter ${activeCategory === 'algorithms' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Algorithms
            </button>
            <button
              onClick={() => handleCategoryChange('data-structures')}
              className={`btn-filter ${activeCategory === 'data-structures' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Data Structures
            </button>
            <button
              onClick={() => handleCategoryChange('system-design')}
              className={`btn-filter ${activeCategory === 'system-design' ? 'btn-primary' : 'btn-secondary'}`}
            >
              System Design
            </button>
          </div>
        </div>

        {loading && challenges.length === 0 ? (
          <div className="text-center py-8">Loading challenges...</div>
        ) : (
          <>
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

            {loading && challenges.length > 0 && (
              <div className="text-center py-4">Loading more...</div>
            )}

            {hasNextPage && !loading && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="btn-primary"
                >
                  Load More
                </button>
              </div>
            )}

            {!hasNextPage && challenges.length > 0 && (
              <div className="text-center mt-8 text-gray-500">
                You've reached the end of the challenges
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-gray-100 p-6 mt-8">
        <div className="container mx-auto text-center">
          <p>GraphQL Developer Hub - A demo site for learning web scraping</p>
          <p className="text-sm text-gray-600 mt-2">This is a simplified example with an in-memory GraphQL API</p>
        </div>
      </footer>
    </div>
  );
}