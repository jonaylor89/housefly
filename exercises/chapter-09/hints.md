# Chapter 9: GraphQL Scraping

## Hint 1
GraphQL APIs use POST requests with a JSON body containing `query` and `variables` fields. Create a helper function that sends these requests to the `/api/graphql` endpoint.

## Hint 2
First, authenticate using a login mutation: `mutation Login($email: String!, $password: String!) { login(email: $email, password: $password) { token } }`. Store the returned token.

## Hint 3
Include the token in subsequent requests using the `Authorization: Bearer <token>` header. This is required to access protected queries like `me`.

## Hint 4
Query both `challenges` (with `edges > node` pattern for pagination) and `me` (for user data including bookmarks and completed challenges) in a single query to match the expected output structure.

## Hint 5
Transform the response to match the expected format: flatten `edges > node` into a plain array for challenges, and map bookmark/completedChallenge objects to just their IDs.
