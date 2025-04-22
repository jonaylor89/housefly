"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { fetchGraphQL } from "@/lib/graphql-client";

type ChallengeDetails = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  description: string;
  starterCode: string;
  solution: string;
  hints: string[];
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
    };
    replies: {
      id: string;
      content: string;
      createdAt: string;
      user: {
        id: string;
        name: string;
      };
    }[];
  }[];
};

type Step =
  | "description"
  | "starter-code"
  | "hints"
  | "solution"
  | "discussion";

export default function ChallengePage({ params }: { params: { id: string } }) {
  const { user, token } = useAuth();
  const [challenge, setChallenge] = useState<ChallengeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<Step>("description");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userCode, setUserCode] = useState("");
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      setLoading(true);
      try {
        const result = await fetchGraphQL(
          `
          query GetChallengeDetails($id: ID!) {
            challenge(id: $id) {
              id
              title
              difficulty
              category
              description
              starterCode
              solution
              hints
              comments {
                id
                content
                createdAt
                user {
                  id
                  name
                }
                replies {
                  id
                  content
                  createdAt
                  user {
                    id
                    name
                  }
                }
              }
            }
            me {
              id
              bookmarks {
                id
              }
              completedChallenges {
                id
              }
            }
          }
          `,
          { id: params.id },
          token,
        );

        setChallenge(result.challenge);

        if (user && result.me) {
          // Check if challenge is bookmarked
          setIsBookmarked(
            result.me.bookmarks.some((c: { id: string }) => c.id === params.id),
          );
          // Check if challenge is completed
          setIsCompleted(
            result.me.completedChallenges.some(
              (c: { id: string }) => c.id === params.id,
            ),
          );
        }

        // Initialize user code with starter code
        if (result.challenge) {
          setUserCode(result.challenge.starterCode);
        }
      } catch (error) {
        console.error("Failed to fetch challenge details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeDetails();
  }, [params.id, token, user]);

  const handleBookmark = async () => {
    if (!user) {
      alert("Please login to bookmark challenges");
      return;
    }

    try {
      const mutation = isBookmarked ? "unbookmark" : "bookmark";
      await fetchGraphQL(
        `
        mutation ${mutation}Challenge($challengeId: ID!) {
          ${mutation}(challengeId: $challengeId) {
            id
            bookmarks {
              id
            }
          }
        }
        `,
        { challengeId: params.id },
        token,
      );

      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error(
        `Failed to ${isBookmarked ? "unbookmark" : "bookmark"} challenge:`,
        error,
      );
    }
  };

  const handleComplete = async () => {
    if (!user) {
      alert("Please login to mark challenges as completed");
      return;
    }

    try {
      await fetchGraphQL(
        `
        mutation CompleteChallenge($challengeId: ID!) {
          completeChallenge(challengeId: $challengeId) {
            id
            completedChallenges {
              id
            }
          }
        }
        `,
        { challengeId: params.id },
        token,
      );

      setIsCompleted(true);
    } catch (error) {
      console.error("Failed to mark challenge as completed:", error);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert("Please login to add comments");
      return;
    }

    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const result = await fetchGraphQL(
        `
        mutation AddComment($challengeId: ID!, $content: String!) {
          addComment(challengeId: $challengeId, content: $content) {
            id
            content
            createdAt
            user {
              id
              name
            }
            replies {
              id
              content
              createdAt
              user {
                id
                name
              }
            }
          }
        }
        `,
        { challengeId: params.id, content: newComment },
        token,
      );

      // Update comments with the new one
      if (challenge) {
        setChallenge({
          ...challenge,
          comments: [...challenge.comments, result.addComment],
        });
      }

      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-blue-800 text-white p-4">
          <div className="container mx-auto">
            <Link href="/" className="text-2xl font-bold">
              GraphQL Developer Hub
            </Link>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center">
          <p>Loading challenge...</p>
        </main>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-blue-800 text-white p-4">
          <div className="container mx-auto">
            <Link href="/" className="text-2xl font-bold">
              GraphQL Developer Hub
            </Link>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center">
          <p>Challenge not found</p>
        </main>
      </div>
    );
  }

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
                <Link href="/challenges" className="hover:underline">
                  Challenges
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
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge badge-${challenge.difficulty}`}>
                {challenge.difficulty}
              </span>
              <span className="badge badge-category">{challenge.category}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={handleBookmark}
              className={`btn ${isBookmarked ? "btn-warning" : "btn-outline"} flex items-center gap-1`}
            >
              <span className="text-lg">{isBookmarked ? "★" : "☆"}</span>
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </button>

            {!isCompleted && (
              <button
                onClick={handleComplete}
                className="btn btn-success flex items-center gap-1"
              >
                <span className="text-lg">✓</span>
                Mark as Completed
              </button>
            )}

            {isCompleted && (
              <div className="btn btn-success flex items-center gap-1 cursor-not-allowed opacity-70">
                <span className="text-lg">✓</span>
                Completed
              </div>
            )}
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`px-4 py-2 ${currentStep === "description" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setCurrentStep("description")}
          >
            Description
          </button>
          <button
            className={`px-4 py-2 ${currentStep === "starter-code" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setCurrentStep("starter-code")}
          >
            Starter Code
          </button>
          <button
            className={`px-4 py-2 ${currentStep === "hints" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setCurrentStep("hints")}
          >
            Hints
          </button>
          {(isCompleted || user?.id === "2") && (
            <button
              className={`px-4 py-2 ${currentStep === "solution" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setCurrentStep("solution")}
            >
              Solution
            </button>
          )}
          <button
            className={`px-4 py-2 ${currentStep === "discussion" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setCurrentStep("discussion")}
          >
            Discussion
          </button>
        </div>

        {currentStep === "description" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Problem Description</h2>
            <div className="prose max-w-none">
              <p>{challenge.description}</p>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => setCurrentStep("starter-code")}
                className="btn-primary"
              >
                Start Coding →
              </button>
            </div>
          </div>
        )}

        {currentStep === "starter-code" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Starter Code</h2>
            <div className="code-block mb-6">{challenge.starterCode}</div>
            <div className="mb-4">
              <label htmlFor="solution" className="block font-medium mb-2">
                Your Solution:
              </label>
              <textarea
                id="solution"
                rows={10}
                className="input-field font-mono"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep("description")}
                className="btn-secondary"
              >
                ← Back to Description
              </button>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep("hints")}
                  className="btn-outline"
                >
                  Need a Hint?
                </button>
                <button onClick={handleComplete} className="btn-success">
                  Submit Solution
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === "hints" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Hints</h2>
            <ul className="list-disc pl-5 space-y-3 prose max-w-none">
              {challenge.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep("starter-code")}
                className="btn-secondary"
              >
                ← Back to Code
              </button>
              {(isCompleted || user?.id === "2") && (
                <button
                  onClick={() => setCurrentStep("solution")}
                  className="btn-primary"
                >
                  View Solution →
                </button>
              )}
            </div>
          </div>
        )}

        {currentStep === "solution" && (isCompleted || user?.id === "2") && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Solution</h2>
            <div className="code-block">{challenge.solution}</div>
            <div className="mt-6">
              <button
                onClick={() => setCurrentStep("discussion")}
                className="btn-primary"
              >
                Join the Discussion →
              </button>
            </div>
          </div>
        )}

        {currentStep === "discussion" && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Discussion</h2>

            {/* Add new comment */}
            {user ? (
              <div className="mb-8">
                <label htmlFor="comment" className="block font-medium mb-2">
                  Add your comment:
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  className="input-field"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your approach or ask a question..."
                ></textarea>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleAddComment}
                    disabled={submittingComment || !newComment.trim()}
                    className="btn-primary disabled:opacity-50"
                  >
                    {submittingComment ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800">
                <p className="mb-2">
                  You need to be logged in to post comments.
                </p>
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Login to join the discussion →
                </Link>
              </div>
            )}

            {/* Comments list */}
            <div className="space-y-6">
              {challenge.comments.length === 0 ? (
                <p className="text-gray-500">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                challenge.comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-700 font-medium">
                        {comment.user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{comment.user.name}</h3>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1">{comment.content}</p>

                        {comment.replies.length > 0 && (
                          <div className="ml-6 mt-3 space-y-3">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="flex items-start gap-2"
                              >
                                <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-gray-700 font-medium text-xs">
                                  {reply.user.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium text-sm">
                                      {reply.user.name}
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                      {new Date(
                                        reply.createdAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-100 p-6 mt-8">
        <div className="container mx-auto text-center">
          <p>GraphQL Developer Hub - A demo site for learning web scraping</p>
          <p className="text-sm text-gray-600 mt-2">
            This is a simplified example with an in-memory GraphQL API
          </p>
        </div>
      </footer>
    </div>
  );
}
