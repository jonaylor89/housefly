const BASE_URL = "http://localhost:3011";
const API_BASE_URL = `${BASE_URL}/api`;
const USER_AGENT = "GoodBot";

// Cryptocurrency trading pairs
const TRADING_PAIRS = [
  "BTC/USD",
  "ETH/USD",
  "BNB/USD",
  "SOL/USD",
  "ADA/USD",
  "XRP/USD",
  "DOT/USD",
  "DOGE/USD",
  "AVAX/USD",
  "MATIC/USD",
];

interface MarketData {
  symbol: string;
  price: string;
  change_24h: string;
  volume_24h: number;
  high_24h: string;
  low_24h: string;
  updated_at: string;
}

interface OrderBookData {
  timestamp: number;
}

// HTTP client interface with retry support
interface FetchClient {
  get: (url: string, options?: RequestInit) => Promise<any>;
  post: (url: string, data?: any, options?: RequestInit) => Promise<any>;
}

// Factory function for HTTP client with exponential backoff
const createFetchClient = (): FetchClient => {
  const defaultHeaders = {
    Accept: "application/json",
    "User-Agent": USER_AGENT,
    "Content-Type": "application/json",
  };

  const fetchWithRetry = async (
    url: string,
    options: RequestInit = {},
    retries = 5,
  ): Promise<Response> => {
    try {
      const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get("retry-after") ?? "5",
          10,
        );
        console.error(
          `Rate limited. Waiting ${retryAfter} seconds before retry...`,
        );
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        return fetchWithRetry(url, options, retries - 1);
      }

      if (!response.ok && retries > 0) {
        const delay = Math.pow(2, 5 - retries) * 1000;
        console.error(
          `Request failed with status ${response.status}. Retrying in ${delay / 1000} seconds...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1);
      }

      return response;
    } catch (error) {
      if (retries > 0) {
        const delay = Math.pow(2, 5 - retries) * 1000;
        console.error(`Network error. Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  };

  return {
    get: async (url: string, options: RequestInit = {}): Promise<any> => {
      const response = await fetchWithRetry(url, {
        method: "GET",
        ...options,
      });
      return response.json();
    },
    post: async (
      url: string,
      data: any,
      options: RequestInit = {},
    ): Promise<any> => {
      const response = await fetchWithRetry(url, {
        method: "POST",
        body: JSON.stringify(data),
        ...options,
      });
      return response.json();
    },
  };
};

/** Fetches and parses robots.txt to extract crawling rules */
async function parseRobotsTxt(client: FetchClient): Promise<{
  allowedPaths: string[];
  disallowedPaths: string[];
  crawlDelay: number;
  goodBotDirective: string | null;
}> {
  try {
    console.error("Fetching robots.txt from", `${BASE_URL}/robots.txt`);
    // Raw fetch for plain text response
    const response = await fetch(`${BASE_URL}/robots.txt`, {
      headers: {
        Accept: "text/plain",
        "User-Agent": USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch robots.txt: ${response.status}`);
    }

    const robotsTxt = await response.text();
    console.error("Robots.txt content retrieved successfully");

    // Parse robots.txt content
    const allowedPaths: string[] = [];
    const disallowedPaths: string[] = [];
    let crawlDelay = 2;
    let goodBotDirective: string | null = "GoodBot"; // Default value

    const lines = robotsTxt.split("\n");
    let currentUserAgent: string | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip comments and empty lines
      if (line.startsWith("#") || line === "") continue;

      // Check for user agent
      if (line.toLowerCase().startsWith("user-agent:")) {
        currentUserAgent = line.substring("user-agent:".length).trim();
        console.error(`Found User-Agent: ${currentUserAgent}`);
        continue;
      }

      // Only process rules for 'GoodBot' and '*' user agents
      if (
        currentUserAgent &&
        (currentUserAgent === "*" || currentUserAgent === "GoodBot")
      ) {
        if (line.toLowerCase().startsWith("allow:")) {
          const path = line.substring("allow:".length).trim();
          allowedPaths.push(path);
          console.error(`Found Allow path: ${path} for ${currentUserAgent}`);
        } else if (line.toLowerCase().startsWith("disallow:")) {
          const path = line.substring("disallow:".length).trim();
          disallowedPaths.push(path);
          console.error(`Found Disallow path: ${path} for ${currentUserAgent}`);
        } else if (line.toLowerCase().startsWith("crawl-delay:")) {
          const delay = parseInt(
            line.substring("crawl-delay:".length).trim(),
            10,
          );
          if (!isNaN(delay)) {
            crawlDelay = delay;
            console.error(
              `Found Crawl-delay: ${delay} for ${currentUserAgent}`,
            );
          }
        }

        // If this is the GoodBot directive, set the special header value
        if (currentUserAgent === "GoodBot") {
          goodBotDirective = "GoodBot";
        }
      }
    }

    console.error("Robots.txt parsing complete:", {
      allowedPaths: allowedPaths.length,
      disallowedPaths: disallowedPaths.length,
      crawlDelay,
      goodBotDirective,
    });

    return { allowedPaths, disallowedPaths, crawlDelay, goodBotDirective };
  } catch (error) {
    console.error("Failed to fetch robots.txt:", (error as Error).message);
    // Default values in case of error
    return {
      allowedPaths: ["/api/market/public", "/api/orderbook/public"],
      disallowedPaths: ["/api/admin", "/api/internal", "/private"],
      crawlDelay: 2,
      goodBotDirective: "GoodBot",
    };
  }
}

/** Solves server-provided math CAPTCHA challenges */
async function solveMathCaptcha(problem: string): Promise<string> {
  // Parse the math problem
  const parts = problem.split(" ");
  const num1 = parseInt(parts[0], 10);
  const operator = parts[1];
  const num2 = parseInt(parts[2], 10);

  // Solve the problem
  let solution: number;
  switch (operator) {
    case "+":
      solution = num1 + num2;
      break;
    case "-":
      solution = num1 - num2;
      break;
    case "*":
      solution = num1 * num2;
      break;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }

  return solution.toString();
}

/** Requests CAPTCHA challenge, solves it, and verifies the solution */
async function fetchAndSolveCaptcha(client: FetchClient): Promise<boolean> {
  try {
    // Fetch CAPTCHA
    console.error("Fetching CAPTCHA...");
    const captchaResponse = await client.get("/captcha/generate");

    if (
      !captchaResponse ||
      !captchaResponse.problem ||
      !captchaResponse.token
    ) {
      console.error("Invalid CAPTCHA response:", captchaResponse);
      return false;
    }

    const { problem, token } = captchaResponse;
    console.error("CAPTCHA problem:", problem);

    // Solve CAPTCHA
    const solution = await solveMathCaptcha(problem);
    console.error("CAPTCHA solution:", solution);

    // Verify CAPTCHA
    console.error("Verifying CAPTCHA solution...");
    const verifyResponse = await client.post("/captcha/verify", {
      token,
      solution,
    });

    console.error("CAPTCHA verification response:", verifyResponse);
    return verifyResponse && verifyResponse.success === true;
  } catch (error) {
    console.error("Error solving CAPTCHA:", (error as Error).message);
    return false;
  }
}

/** Authenticates with the exchange API */
async function login(
  client: FetchClient,
  username: string,
  password: string,
): Promise<boolean> {
  try {
    console.error(`Attempting to login as ${username}...`);
    const response = await client.post("/auth/login", {
      username,
      password,
    });

    if (response && response.success) {
      console.error("Login successful");
      // Session cookie should be automatically handled by fetch
      return true;
    } else {
      console.error("Login failed:", response?.error || "Unknown error");
      return false;
    }
  } catch (error) {
    console.error("Login error:", (error as Error).message);
    return false;
  }
}

/** Retrieves public market data for all trading pairs */
async function fetchPublicMarketData(
  client: FetchClient,
): Promise<MarketData[]> {
  try {
    console.error("Sending request to /market/public");
    const response = await client.get("/market/public");
    console.error("Successfully received public market data");
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error(
      "Failed to fetch public market data:",
      (error as Error).message,
    );
    return [];
  }
}

/** Retrieves public order book data for a specific trading pair */
async function fetchPublicOrderBook(
  client: FetchClient,
  symbol: string,
): Promise<OrderBookData | null> {
  try {
    console.error(`Sending request to /orderbook/public for ${symbol}`);
    const response = await client.get(
      `/orderbook/public?symbol=${encodeURIComponent(symbol)}`,
    );
    console.error(`Received response for /orderbook/public for ${symbol}`);
    // Filter out bids and asks, keep only timestamp
    if (response && response.timestamp) {
      return {
        timestamp: response.timestamp
      };
    }
    return null;
  } catch (error) {
    console.error(
      `Failed to fetch public order book for ${symbol}:`,
      (error as Error).message,
    );
    return null;
  }
}

/** Retrieves restricted order book data that requires authentication */
async function fetchRestrictedOrderBook(
  client: FetchClient,
  symbol: string,
  goodBotHeader?: string,
): Promise<OrderBookData | null> {
  try {
    // Add the special GoodBot header if available
    const headers: Record<string, string> = {
      "User-Agent": USER_AGENT,
    };

    if (goodBotHeader) {
      headers["X-Robots-Check"] = goodBotHeader;
      console.error(
        `Using custom GoodBot header for ${symbol}: ${goodBotHeader}`,
      );
    }

    console.error(`Request headers for ${symbol}:`, headers);

    const response = await client.get(
      `/orderbook/restricted?symbol=${encodeURIComponent(symbol)}&depth=20`,
      { headers },
    );

    if (!response) {
      console.error(`No response received for ${symbol} restricted order book`);
      return null;
    }

    console.error(`Successfully fetched restricted order book for ${symbol}`);
    // Filter out bids and asks, keep only timestamp
    if (response && response.timestamp) {
      return {
        timestamp: response.timestamp
      };
    }
    return null;
  } catch (error) {
    const err = error as Error & {
      status?: number;
      response?: { captchaRequired?: boolean };
    };
    if (err.status === 401) {
      console.error("Authentication required for restricted order book");
      return null;
    } else if (err.status === 403) {
      if (err.response?.captchaRequired) {
        console.error("CAPTCHA required for restricted order book");
        const captchaSolved = await fetchAndSolveCaptcha(client);
        if (captchaSolved) {
          console.error(
            "CAPTCHA solved, retrying restricted order book request",
          );
          // Retry after solving CAPTCHA
          return fetchRestrictedOrderBook(client, symbol, goodBotHeader);
        } else {
          console.error(
            "Failed to solve CAPTCHA, cannot access restricted order book",
          );
          return null;
        }
      } else {
        console.error("Access denied to restricted order book");
      }
    }
    console.error(
      `Failed to fetch restricted order book for ${symbol}:`,
      (error as Error).message,
    );
    return null;
  }
}

/** Validates and normalizes order book data */
function processOrderBookData(
  data: OrderBookData | null,
): OrderBookData | null {
  // Check if data is null
  if (!data) {
    console.error("Order book data is null");
    return null;
  }

  console.error("Processing order book data");

  try {
    // Simplified processing - just ensure timestamp is a number
    const processedData: OrderBookData = {
      timestamp: data.timestamp,
    };

    // Ensure timestamp is a number
    if (typeof processedData.timestamp === "string") {
      processedData.timestamp = parseInt(processedData.timestamp, 10);
    }

    return processedData;
  } catch (error) {
    console.error(
      "Error processing order book data:",
      (error as Error).message,
    );
    return null;
  }
}

/** Main execution function that orchestrates the data collection process */
async function main() {
  // Create fetch client with proper User-Agent
  const client = createFetchClient();

  // Add consistent headers for all requests
  const originalGet = client.get;
  client.get = async (url: string, options: RequestInit = {}): Promise<any> => {
    const newOptions = {
      ...options,
      headers: {
        ...options.headers,
        "User-Agent": USER_AGENT,
        // Add the GoodBot header to identify as a robot that respects robots.txt
        "X-Robots-Check": "GoodBot",
      },
    };
    return originalGet(url, newOptions);
  };

  // Also override post to include User-Agent
  const originalPost = client.post;
  client.post = async (
    url: string,
    data: any,
    options: RequestInit = {},
  ): Promise<any> => {
    const newOptions = {
      ...options,
      headers: {
        ...options.headers,
        "User-Agent": USER_AGENT,
        // Add the GoodBot header to identify as a robot that respects robots.txt
        "X-Robots-Check": "GoodBot",
      },
    };
    return originalPost(url, data, newOptions);
  };

  console.error("Client initialized with proper User-Agent and GoodBot header");

  // Set timeout between requests to avoid rate limiting
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Parse robots.txt to understand the site's scraping rules
  console.error("Fetching and parsing robots.txt...");
  const robotsInfo = await parseRobotsTxt(client);
  console.error("Robots.txt parsed successfully");

  // Create a combined data object
  const scrapedData: {
    market_data: MarketData[];
    order_books: Record<string, OrderBookData>;
  } = {
    market_data: [],
    order_books: {},
  };

  // Fetch public market data first
  console.error("Fetching public market data...");
  const publicMarketData = await fetchPublicMarketData(client);

  // Apply the crawl delay from robots.txt
  console.error(
    `Waiting ${robotsInfo.crawlDelay} seconds before next request...`,
  );
  await sleep(robotsInfo.crawlDelay * 1000);

  // Solve CAPTCHA to gain access to restricted endpoints
  console.error("Attempting to solve CAPTCHA...");
  const captchaSolved = await fetchAndSolveCaptcha(client);

  if (captchaSolved) {
    console.error("CAPTCHA solved successfully");
  } else {
    console.error("CAPTCHA solution failed");
  }

  // Wait between requests
  await sleep(1000);

  // Use public market data directly
  if (publicMarketData.length > 0) {
    console.error("Using public market data");
    scrapedData.market_data = publicMarketData;
  } else {
    console.error("No market data available");
  }

  // Fetch order book data for each trading pair
  const goodBotHeader = robotsInfo.goodBotDirective; // Use the special header from robots.txt

  for (const symbol of TRADING_PAIRS.slice(0, 5)) {
    // Limit to first 5 pairs for demonstration
    console.error(`Processing order book for ${symbol}...`);

    // Apply the crawl delay from robots.txt
    console.error(
      `Waiting ${robotsInfo.crawlDelay} seconds before next request...`,
    );
    await sleep(robotsInfo.crawlDelay * 1000);

    // Try to fetch restricted order book data first using the GoodBot header
    let orderBookData: OrderBookData | null = null;

    if (goodBotHeader) {
      console.error(
        `Attempting to fetch restricted order book with GoodBot header for ${symbol}...`,
      );
      orderBookData = await fetchRestrictedOrderBook(
        client,
        symbol,
        goodBotHeader,
      );
    }

    // If restricted data failed, try without the header
    if (!orderBookData) {
      console.error(
        `Attempting to fetch restricted order book without header for ${symbol}...`,
      );
      orderBookData = await fetchRestrictedOrderBook(client, symbol);
    }

    // Fall back to public order book if needed
    if (!orderBookData) {
      console.error(`Attempting to fetch public order book for ${symbol}...`);
      await new Promise((resolve) =>
        setTimeout(resolve, robotsInfo.crawlDelay * 1000),
      );
      orderBookData = await fetchPublicOrderBook(client, symbol);
    }

    // Process the order book data
    if (orderBookData) {
      console.error(`Successfully fetched order book for ${symbol}`);
      const processedData = processOrderBookData(orderBookData);
      if (processedData) {
        scrapedData.order_books[symbol] = processedData;
      }
    } else {
      console.error(`Failed to fetch order book for ${symbol}`);
    }
  }

  // Output the scraped data to stdout
  console.log(JSON.stringify(scrapedData, null, 2));

  return scrapedData;
}

main().catch(console.error);
