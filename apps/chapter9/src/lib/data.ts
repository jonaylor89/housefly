// In-memory data for GraphQL API

export type Challenge = {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: "algorithms" | "data-structures" | "system-design";
  description: string;
  starterCode: string;
  solution: string;
  hints: string[];
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  bookmarks: string[];
  completedChallenges: string[];
};

export type Comment = {
  id: string;
  challengeId: string;
  userId: string;
  content: string;
  createdAt: string;
  replies: Reply[];
};

export type Reply = {
  id: string;
  commentId: string;
  userId: string;
  content: string;
  createdAt: string;
};

// Sample data
export const users: User[] = [
  {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    password: "password123",
    bookmarks: ["1", "3"],
    completedChallenges: ["2"],
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    bookmarks: ["2"],
    completedChallenges: ["1", "3"],
  },
];

export const challenges: Challenge[] = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "easy",
    category: "algorithms",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    starterCode: "function twoSum(nums, target) {\n  // Your code here\n}",
    solution:
      "function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map[complement] !== undefined) {\n      return [map[complement], i];\n    }\n    map[nums[i]] = i;\n  }\n  return [];\n}",
    hints: [
      "Consider using a hash map to store values you've seen",
      "Think about what the complement of the current number would be",
    ],
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Linked List Cycle",
    difficulty: "medium",
    category: "data-structures",
    description:
      "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    starterCode: "function hasCycle(head) {\n  // Your code here\n}",
    solution:
      "function hasCycle(head) {\n  if (!head || !head.next) return false;\n  let slow = head;\n  let fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}",
    hints: [
      "Consider using Floyd's Cycle-Finding Algorithm",
      "Try using two pointers moving at different speeds",
    ],
    createdAt: "2023-02-01T00:00:00Z",
  },
  {
    id: "3",
    title: "Design a Rate Limiter",
    difficulty: "hard",
    category: "system-design",
    description:
      "Design a rate limiter that prevents a user from making too many API requests within a certain time frame.",
    starterCode:
      "class RateLimiter {\n  constructor() {\n    // Your initialization code here\n  }\n  \n  isAllowed(userId) {\n    // Your code here\n  }\n}",
    solution:
      "class RateLimiter {\n  constructor(maxRequests = 100, windowMs = 60000) {\n    this.maxRequests = maxRequests;\n    this.windowMs = windowMs;\n    this.requests = {}; // userId -> [timestamps]\n  }\n  \n  isAllowed(userId) {\n    const now = Date.now();\n    if (!this.requests[userId]) {\n      this.requests[userId] = [now];\n      return true;\n    }\n    \n    // Filter requests within the time window\n    const windowStart = now - this.windowMs;\n    this.requests[userId] = this.requests[userId].filter(time => time > windowStart);\n    \n    if (this.requests[userId].length < this.maxRequests) {\n      this.requests[userId].push(now);\n      return true;\n    }\n    \n    return false;\n  }\n}",
    hints: [
      "Think about using a sliding window approach",
      "Consider how to efficiently clean up old request data",
    ],
    createdAt: "2023-03-01T00:00:00Z",
  },
];

export const comments: Comment[] = [
  {
    id: "1",
    challengeId: "1",
    userId: "2",
    content: "This is a great starter problem for hash map usage!",
    createdAt: "2023-01-15T10:30:00Z",
    replies: [
      {
        id: "1",
        commentId: "1",
        userId: "1",
        content: "Agreed! It helped me understand hash maps better.",
        createdAt: "2023-01-15T11:45:00Z",
      },
    ],
  },
  {
    id: "2",
    challengeId: "2",
    userId: "1",
    content: "The two-pointer technique is really elegant for this problem.",
    createdAt: "2023-02-10T14:20:00Z",
    replies: [],
  },
];
