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
      <header className="bg-[#282828] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            GraphQL Developer Hub
          </Link>
          <nav>
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
                <span className="text-gray-300">Welcome, {user.name}</span>
              </div>
            ) : (
              <Link href="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Coding Challenges</h1>
        
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`${!activeCategory ? 'bg-[#3c8ffe] text-white' : 'bg-[#f3f4f5] dark:bg-[#2c2c2c] text-gray-700 dark:text-gray-300'} rounded px-3 py-1.5 text-sm font-medium transition-colors`}
            >
              All Categories
            </button>
            <button
              onClick={() => handleCategoryChange('algorithms')}
              className={`${activeCategory === 'algorithms' ? 'bg-[#3c8ffe] text-white' : 'bg-[#f3f4f5] dark:bg-[#2c2c2c] text-gray-700 dark:text-gray-300'} rounded px-3 py-1.5 text-sm font-medium transition-colors`}
            >
              Algorithms
            </button>
            <button
              onClick={() => handleCategoryChange('data-structures')}
              className={`${activeCategory === 'data-structures' ? 'bg-[#3c8ffe] text-white' : 'bg-[#f3f4f5] dark:bg-[#2c2c2c] text-gray-700 dark:text-gray-300'} rounded px-3 py-1.5 text-sm font-medium transition-colors`}
            >
              Data Structures
            </button>
            <button
              onClick={() => handleCategoryChange('system-design')}
              className={`${activeCategory === 'system-design' ? 'bg-[#3c8ffe] text-white' : 'bg-[#f3f4f5] dark:bg-[#2c2c2c] text-gray-700 dark:text-gray-300'} rounded px-3 py-1.5 text-sm font-medium transition-colors`}
            >
              System Design
            </button>
          </div>
        </div>

        {loading && challenges.length === 0 ? (
          <div className="text-center py-8">Loading challenges...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="card hover:shadow-md transition-all duration-200 hover:border-[#3c8ffe]/20">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 tracking-tight">{challenge.title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`badge badge-${challenge.difficulty}`}>
                        {challenge.difficulty}
                      </span>
                      <span className="badge badge-category">
                        {challenge.category}
                      </span>
                    </div>
                    <Link href={`/challenges/${challenge.id}`} className="text-[#3c8ffe] hover:text-[#265f96] font-medium inline-flex items-center">
                      View Challenge
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
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
                  className="btn-primary hover:shadow-md inline-flex items-center"
                >
                  Load More
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
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

      <footer className="bg-[#f3f4f5] dark:bg-[#282828] p-5 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-gray-700 dark:text-gray-300">GraphQL Developer Hub - A demo site for learning web scraping</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">This is a simplified example with an in-memory GraphQL API</p>
        </div>
      </footer>
    </div>
  );
}