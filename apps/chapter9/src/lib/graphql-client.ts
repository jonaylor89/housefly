/**
 * Simple GraphQL client for the Developer Hub
 */

export async function fetchGraphQL(query: string, variables = {}, token?: string | null) {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    return json.data;
  } catch (error) {
    console.error('GraphQL client error:', error);
    throw error;
  }
}