import { challenges, comments, users } from "./data";

type Context = {
  user?: { id: string };
};

export const resolvers = {
  Query: {
    challenges: (
      _: any,
      args: { category?: string; first?: number; after?: string },
    ) => {
      let filteredChallenges = [...challenges];

      // Filter by category if provided
      if (args.category) {
        filteredChallenges = filteredChallenges.filter(
          (c) => c.category === args.category,
        );
      }

      // Handle pagination
      const first = args.first || 10;
      let afterIndex = -1;

      if (args.after) {
        const decodedCursor = Buffer.from(args.after, "base64").toString(
          "ascii",
        );
        afterIndex = filteredChallenges.findIndex(
          (c) => c.id === decodedCursor,
        );
      }

      const edges = filteredChallenges
        .slice(afterIndex + 1, afterIndex + 1 + first)
        .map((challenge) => ({
          cursor: Buffer.from(challenge.id).toString("base64"),
          node: challenge,
        }));

      const hasNextPage = afterIndex + 1 + first < filteredChallenges.length;
      const endCursor =
        edges.length > 0 ? edges[edges.length - 1].cursor : null;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor,
        },
      };
    },
    challenge: (_: any, { id }: { id: string }) => {
      return challenges.find((c) => c.id === id) || null;
    },
    me: (_: any, __: any, context: Context) => {
      const user = context.user;
      if (!user) return null;
      return users.find((u) => u.id === user.id) || null;
    },
  },
  Challenge: {
    comments: (parent: { id: string }) => {
      return comments.filter((c) => c.challengeId === parent.id);
    },
  },
  Comment: {
    user: (parent: { userId: string }) => {
      return users.find((u) => u.id === parent.userId);
    },
  },
  Reply: {
    user: (parent: { userId: string }) => {
      return users.find((u) => u.id === parent.userId);
    },
  },
  User: {
    bookmarks: (parent: { bookmarks: string[] }) => {
      return parent.bookmarks
        .map((id) => challenges.find((c) => c.id === id))
        .filter(Boolean);
    },
    completedChallenges: (parent: { completedChallenges: string[] }) => {
      return parent.completedChallenges
        .map((id) => challenges.find((c) => c.id === id))
        .filter(Boolean);
    },
  },
  Mutation: {
    login: (
      _: any,
      { email, password }: { email: string; password: string },
    ) => {
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );
      if (!user) {
        throw new Error("Invalid credentials");
      }
      // Generate a simple token (in a real app, use JWT)
      const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");
      return { token, user };
    },
    bookmark: (
      _: any,
      { challengeId }: { challengeId: string },
      context: Context,
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      const userIndex = users.findIndex((u) => u.id === context.user?.id);
      if (userIndex === -1) throw new Error("User not found");

      const user = users[userIndex];
      if (!user.bookmarks.includes(challengeId)) {
        user.bookmarks.push(challengeId);
      }

      return user;
    },
    unbookmark: (
      _: any,
      { challengeId }: { challengeId: string },
      context: Context,
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      const userIndex = users.findIndex((u) => u.id === context.user?.id);
      if (userIndex === -1) throw new Error("User not found");

      const user = users[userIndex];
      user.bookmarks = user.bookmarks.filter((id) => id !== challengeId);

      return user;
    },
    completeChallenge: (
      _: any,
      { challengeId }: { challengeId: string },
      context: Context,
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      const userIndex = users.findIndex((u) => u.id === context.user?.id);
      if (userIndex === -1) throw new Error("User not found");

      const user = users[userIndex];
      if (!user.completedChallenges.includes(challengeId)) {
        user.completedChallenges.push(challengeId);
      }

      return user;
    },
    addComment: (
      _: any,
      { challengeId, content }: { challengeId: string; content: string },
      context: Context,
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      const newComment = {
        id: String(comments.length + 1),
        challengeId,
        userId: context.user.id,
        content,
        createdAt: new Date().toISOString(),
        replies: [],
      };

      comments.push(newComment);
      return newComment;
    },
    addReply: (
      _: any,
      { commentId, content }: { commentId: string; content: string },
      context: Context,
    ) => {
      if (!context.user) throw new Error("Not authenticated");

      const commentIndex = comments.findIndex((c) => c.id === commentId);
      if (commentIndex === -1) throw new Error("Comment not found");

      const newReply = {
        id: String(comments[commentIndex].replies.length + 1),
        commentId,
        userId: context.user.id,
        content,
        createdAt: new Date().toISOString(),
      };

      comments[commentIndex].replies.push(newReply);
      return newReply;
    },
  },
};
