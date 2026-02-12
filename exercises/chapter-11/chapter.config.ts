export default {
  id: "chapter-11",
  title: "Polite Scraping",
  targetUrl: "http://localhost:3011",
  output: { kind: "json" },
  hints: [
    "Start by fetching and parsing `/robots.txt` to discover allowed paths, disallowed paths, and the crawl delay.",
    "Set your User-Agent to `GoodBot` and include an `X-Robots-Check: GoodBot` header to access restricted endpoints.",
    "Implement a CAPTCHA solver: fetch a math problem from `/api/captcha/generate`, solve it, and verify via `/api/captcha/verify`.",
  ],
  checkpoints: [
    { id: "parse-robots", description: "Fetch and parse robots.txt to extract crawling rules and crawl delay" },
    { id: "http-client", description: "Create an HTTP client with proper headers, retry logic, and rate limit handling" },
    { id: "solve-captcha", description: "Solve the math CAPTCHA challenge to gain access to restricted endpoints" },
    { id: "fetch-market-data", description: "Fetch public market data for all trading pairs" },
    { id: "fetch-order-books", description: "Fetch order book data (restricted or public fallback) for the first 5 trading pairs" },
  ],
} as const;
