export default {
  id: "chapter-08",
  title: "Authentication & Forms",
  targetUrl: "http://localhost:3008",
  output: { kind: "json" },
  hints: [
    "Use Playwright to navigate to the login page and fill in the email/password form fields.",
    "After logging in, navigate to the multi-step search form and complete each step sequentially.",
    "Extract search results from the DOM, including premium listings only visible to logged-in users.",
  ],
  checkpoints: [
    {
      id: "login",
      description: "Successfully log in with the provided credentials",
    },
    {
      id: "multi-step-form",
      description:
        "Complete the multi-step search form (destination, dates, filters)",
    },
    {
      id: "extract-results",
      description: "Extract search results including premium listings",
    },
    {
      id: "save-search",
      description: "Save the search and verify it appears in the dashboard",
    },
  ],
} as const;
