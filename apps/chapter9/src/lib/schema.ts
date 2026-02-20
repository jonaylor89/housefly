import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    bookmarks: [Challenge!]!
    completedChallenges: [Challenge!]!
  }

  type Challenge {
    id: ID!
    title: String!
    difficulty: String!
    category: String!
    description: String!
    starterCode: String!
    solution: String
    hints: [String!]!
    createdAt: String!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    challengeId: ID!
    user: User!
    content: String!
    createdAt: String!
    replies: [Reply!]!
  }

  type Reply {
    id: ID!
    commentId: ID!
    user: User!
    content: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    challenges(category: String, first: Int, after: String): ChallengeConnection!
    challenge(id: ID!): Challenge
    me: User
  }

  type ChallengeConnection {
    edges: [ChallengeEdge!]!
    pageInfo: PageInfo!
  }

  type ChallengeEdge {
    cursor: String!
    node: Challenge!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload
    bookmark(challengeId: ID!): User
    unbookmark(challengeId: ID!): User
    completeChallenge(challengeId: ID!): User
    addComment(challengeId: ID!, content: String!): Comment
    addReply(commentId: ID!, content: String!): Reply
  }
`;
