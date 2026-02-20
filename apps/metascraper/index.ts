import {
  // BaseHttpClient,
  // HttpRequest,
  // HttpResponse,
  PlaywrightCrawler,
  // RedirectHandler,
  // ResponseTypes,
  // StreamingHttpResponse,
} from "crawlee";
import * as cheerio from "cheerio";
import * as fs from "node:fs/promises";
import OpenAI from "openai";
// import { Readable } from 'node:stream';
// import { Buffer } from "node:buffer";

// Initialize OpenAI client for AI-assisted parsing
const openai = new OpenAI();

// Define the chapters to crawl
const chapters = [
  "https://housefly-chapter1.netlify.app",
  "https://chapter2.housefly.cc",
  "https://chapter3.housefly.cc",
  "https://chapter4.housefly.cc",
  "https://chapter5.housefly.cc",
  "https://chapter6.housefly.cc",
  "https://chapter7.housefly.cc",
  "https://chapter8.housefly.cc",
  "https://chapter9.housefly.cc",
  "http://chapter10.housefly.cc",
  "https://chapter11.housefly.cc",
];

interface IndexEntry {
  url: string;
  title: string;
  content: string;
  keywords: string[];
  chapterNumber: number;
  extractedData?: any;
}

const searchIndex: IndexEntry[] = [];

// class CustomHttpClient implements BaseHttpClient {
//   async sendRequest<TResponseType extends keyof ResponseTypes = "text">(
//     request: HttpRequest<TResponseType>,
//   ): Promise<HttpResponse<TResponseType>> {
//     const { url, method = "GET", headers = {}, payload } = request;

//     const options: RequestInit = {
//       method,
//       headers: headers ? new Headers(headers as HeadersInit) : undefined,
//       body: payload ? JSON.stringify(payload) : undefined,
//     };

//     const response = await fetch(url, options);
//     const contentType = response.headers.get("content-type") || "";

//     let responseBody: any;
//     if (
//       request.responseType === "json" ||
//       contentType.includes("application/json")
//     ) {
//       responseBody = await response.json();
//     } else if (request.responseType === "buffer") {
//       const arrayBuffer = await response.arrayBuffer();
//       responseBody = Buffer.from(arrayBuffer);
//     } else {
//       responseBody = await response.text();
//     }

//     return {
//       url: response.url,
//       statusCode: response.status,
//       headers: Object.fromEntries(response.headers.entries()),
//       body: responseBody as any,
//       request,
//       redirectUrls: [],
//       trailers: {},
//       complete: true,
//     };
//   }

//   async stream(
//     request: HttpRequest,
//     _onRedirect?: RedirectHandler,
//   ): Promise<StreamingHttpResponse> {
//     // Simple implementation that fetches the content and converts it to a stream
//     const response = await fetch(request.url, {
//       method: request.method || "GET",
//       headers: request.headers
//         ? new Headers(request.headers as HeadersInit)
//         : undefined,
//       body: request.payload ? JSON.stringify(request.payload) : undefined,
//     });

//     // Create a readable stream from the response body
//     const responseBody = await response.arrayBuffer();
//     const buffer = Buffer.from(responseBody);
//     const nodeStream = Readable.from(buffer);

//     // Create StreamingHttpResponse object
//     const streamingResponse: StreamingHttpResponse = {
//       url: response.url,
//       statusCode: response.status,
//       headers: Object.fromEntries(response.headers.entries()),
//       request,
//       stream: nodeStream,
//       complete: true,
//       downloadProgress: {
//         percent: 100,
//         transferred: buffer.length,
//         total: buffer.length,
//       },
//       uploadProgress: { percent: 0, transferred: 0 },
//       redirectUrls: [],
//       trailers: {},
//     };

//     return streamingResponse;
//   }
// }

// Function to extract structured data from unstructured content using OpenAI
async function extractStructuredData(
  title: string,
  content: string,
): Promise<any> {
  try {
    // Prepare the request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content:
            "You extract structured data from webpages and return it as JSON.",
        },
        {
          role: "user",
          content: `Extract structured data from this webpage content. Return a JSON object with the key information.

Title: ${title}
Content: ${content.substring(0, 4000)}`, // Limit content length
        },
      ],
      response_format: { type: "json_object" },
    });

    // Extract the response content
    const responseText = response.choices[0]?.message?.content || "{}";

    // Parse the JSON response
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      return {};
    }
  } catch (error) {
    console.error("Error using OpenAI:", error);
    return {};
  }
}

async function runCrawler() {
  await fs.mkdir("./data", { recursive: true });

  const crawler = new PlaywrightCrawler({
    // httpClient: new CustomHttpClient(),
    maxConcurrency: 1, // Reduced to avoid overwhelming sites
    maxRequestRetries: 5,
    navigationTimeoutSecs: 60,
    requestHandlerTimeoutSecs: 120,
    maxRequestsPerMinute: 10, // Rate limiting to be gentler on servers
    launchContext: {
      launchOptions: {
        headless: true,
      },
    },
    retryOnBlocked: true,

    // Main processing function
    async requestHandler({ request, page, enqueueLinks, log }) {
      const url = request.url;
      log.info(`Processing: ${url}`);

      // Extract chapter number from URL (supports both Netlify and housefly.cc domains)
      const chapterMatch = url.match(/chapter(\d+)/i);
      const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : 0;

      try {
        // Wait briefly before navigation to avoid overwhelming servers
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Wait for the content to load with a more robust strategy
        await page.waitForLoadState("domcontentloaded");
        await page
          .waitForLoadState("networkidle", { timeout: 30000 })
          .catch(() => {
            log.warning(
              `Network didn't reach idle state for ${url}, continuing anyway`,
            );
          });

        // Get page content
        const title = await page.title();
        const content = await page.content();

        // Use Cheerio to parse content and extract text
        const $ = cheerio.load(content);
        const bodyText = $("body").text().replace(/\s+/g, " ").trim();

        // Basic keyword extraction
        const keywords = bodyText
          .toLowerCase()
          .split(/\W+/)
          .filter((word) => word.length > 3)
          .filter((word, i, arr) => arr.indexOf(word) === i)
          .slice(0, 20);

        // Use AI to extract structured data from the content
        const extractedData = await extractStructuredData(title, bodyText);

        // Add to search index
        searchIndex.push({
          url,
          title,
          content: bodyText.substring(0, 1000), // Store preview
          keywords,
          chapterNumber,
          extractedData,
        });

        // Discover and enqueue links only if we're on a chapter site
        // and the URL is not already in our index
        if (chapterNumber > 0) {
          // Find all links on the page
          await enqueueLinks({
            strategy: "same-hostname",
          });
        }
      } catch (error) {
        log.error(`Error processing ${url}: ${error}`);
        // Add a basic entry to search index so we have something
        searchIndex.push({
          url,
          title: `Chapter ${chapterNumber} Page (Error)`,
          content: `Error processing this page: ${error}`,
          keywords: [],
          chapterNumber,
          extractedData: {},
        });
      }
    },

    // Handle errors
    async failedRequestHandler({ request, log, error }) {
      const url = request.url;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      log.error(`Request failed: ${url}. Error: ${errorMessage}`);

      // Try to extract chapter number from the URL
      const chapterMatch = url.match(/chapter(\d+)/i);
      const chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : 0;

      // Add a placeholder entry in the search index so we at least have something
      searchIndex.push({
        url,
        title: `Chapter ${chapterNumber} Page (Failed)`,
        content: `Could not process this page after multiple attempts. Error: ${errorMessage}`,
        keywords: [],
        chapterNumber,
        extractedData: {},
      });
    },
  });

  // Start the crawler with our initial URLs
  await crawler.run(chapters);

  // Save the search index to disk
  await fs.writeFile(
    "./data/search_index.json",
    JSON.stringify(searchIndex, null, 2),
  );

  // Generate stats
  const stats = {
    totalPages: searchIndex.length,
    pagesPerChapter: {} as Record<number, number>,
    totalKeywords: searchIndex.reduce(
      (sum, entry) => sum + entry.keywords.length,
      0,
    ),
    dataCaptured: new Date().toISOString(),
  };

  // Count pages per chapter
  searchIndex.forEach((entry) => {
    if (!stats.pagesPerChapter[entry.chapterNumber]) {
      stats.pagesPerChapter[entry.chapterNumber] = 0;
    }
    stats.pagesPerChapter[entry.chapterNumber]++;
  });

  await fs.writeFile("./data/stats.json", JSON.stringify(stats, null, 2));

  console.log("Crawling complete!");
  console.log(
    `Processed ${searchIndex.length} pages across the Housefly chapters.`,
  );
  console.log("Search index saved to ./data/search_index.json");
  console.log("Stats saved to ./data/stats.json");
}

// Simple search function to query the index
async function searchFunction(query: string, limit = 5) {
  try {
    // Load the search index
    const indexData = await fs.readFile("./data/search_index.json", "utf-8");
    const index: IndexEntry[] = JSON.parse(indexData);

    // Split query into terms
    const terms = query
      .toLowerCase()
      .split(/\W+/)
      .filter((term) => term.length > 2);

    // Score each document based on term frequency
    const results = index
      .map((entry) => {
        const score = terms.reduce((sum, term) => {
          // Check title (high weight)
          if (entry.title.toLowerCase().includes(term)) sum += 5;

          // Check content
          if (entry.content.toLowerCase().includes(term)) sum += 3;

          // Check keywords
          if (entry.keywords.includes(term)) sum += 2;

          return sum;
        }, 0);

        return { entry, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results.map((item) => ({
      url: item.entry.url,
      title: item.entry.title,
      preview: item.entry.content.substring(0, 150) + "...",
      score: item.score,
      chapterNumber: item.entry.chapterNumber,
    }));
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

// CLI interaction
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "crawl") {
    console.log("Starting crawler...");
    await runCrawler();
  } else if (command === "search") {
    const query = args.slice(1).join(" ");
    if (!query) {
      console.log("Please provide a search query.");
      return;
    }

    console.log(`Searching for: "${query}"...`);
    const results = await searchFunction(query);

    if (results.length === 0) {
      console.log("No results found.");
    } else {
      console.log(`Found ${results.length} results:\n`);
      results.forEach((result, i) => {
        console.log(
          `${i + 1}. ${result.title} (Chapter ${result.chapterNumber})`,
        );
        console.log(`   URL: ${result.url}`);
        console.log(`   ${result.preview}`);
        console.log();
      });
    }
  } else {
    console.log(`
Housefly MetaScraper - Chapter 7: Large-Scale & Unstructured Web Crawling
`);
    console.log("Usage:");
    console.log(
      "  npm start -- crawl      # Crawl all chapter websites and build search index",
    );
    console.log(
      "  npm start -- search <query>  # Search the index for specific terms",
    );
  }
}

main().catch(console.error);
