const TARGET_URL = "http://localhost:3009";
const GRAPHQL_ENDPOINT = `${TARGET_URL}/api/graphql`;

const DEMO_USER_EMAIL = "user@example.com";
const DEMO_USER_PASSWORD = "password123";

// Helper function to make GraphQL requests
async function fetchGraphQL(
  query: string,
  variables: Record<string, any> = {},
  token?: string,
): Promise<any> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2));
      throw new Error(`GraphQL Error: ${json.errors[0].message}`);
    }

    return json.data;
  } catch (error) {
    console.error("Failed to fetch GraphQL:", error);
    throw error;
  }
}

// Function to log in the demo user and get a token
async function loginDemoUser(): Promise<string | null> {
  const loginMutation = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
      }
    }
  `;

  try {
    const data = await fetchGraphQL(loginMutation, {
      email: DEMO_USER_EMAIL,
      password: DEMO_USER_PASSWORD,
    });

    return data.login.token;
  } catch (error) {
    console.error("Login failed. Make sure the demo server is running.", error);
    return null;
  }
}

// Main function to fetch data and log it
async function main() {
  const token = await loginDemoUser();

  if (!token) {
    console.log("Could not obtain auth token. Exiting.");
    return;
  }

  // GraphQL query to fetch the first 3 challenges and user data
  const dataQuery = `
    query GetSolutionData {
      challenges {
        edges {
          node {
            id
            title
            difficulty
            category
            description
          }
        }
      }
      me {
        id
        name
        email
        bookmarks {
          id
        }
        completedChallenges {
          id
        }
      }
    }
  `;

  try {
    const data = await fetchGraphQL(dataQuery, {}, token);

    // Structure the data to match expected.json
    const result = {
      challenges: data.challenges.edges.map((edge: any) => edge.node),
      user: {
        ...data.me,
        bookmarks: data.me?.bookmarks?.map((b: any) => b.id),
        completedChallenges: data.me?.completedChallenges?.map(
          (c: any) => c.id,
        ),
      },
    };

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Failed to fetch data after login:", error);
  }
}

// Run the main function
main().catch(console.error);
