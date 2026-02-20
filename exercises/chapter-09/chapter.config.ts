export default {
  id: "chapter-09",
  title: "GraphQL Scraping",
  targetUrl: "http://localhost:3009",
  output: { kind: "json" },
  hints: [
    "GraphQL APIs use POST requests with a JSON body containing `query` and `variables` fields.",
    "Authenticate first with a login mutation to get a Bearer token for subsequent requests.",
    "Query both `challenges` and `me` fields, then transform the response to match the expected output format.",
  ],
  checkpoints: [
    {
      id: "graphql-helper",
      description: "Create a helper function to send GraphQL POST requests",
    },
    {
      id: "authenticate",
      description: "Log in via a GraphQL mutation and obtain an auth token",
    },
    {
      id: "fetch-data",
      description: "Query challenges and user data using the auth token",
    },
    {
      id: "transform-output",
      description:
        "Transform the GraphQL response to match the expected JSON structure",
    },
  ],
} as const;
