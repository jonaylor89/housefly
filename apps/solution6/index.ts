import {
  log,
  BaseHttpClient,
  CheerioCrawler,
  HttpRequest,
  HttpResponse,
  RedirectHandler,
  ResponseTypes,
  StreamingHttpResponse,
  LogLevel,
} from "crawlee";

import { Readable } from "node:stream";
import { Buffer } from "node:buffer";

const URI = "https://chapter6.housefly.cc";

interface ProductFeature {
  name: string;
  price: number;
  rating: {
    score: number;
    count: number;
  };
  features: string[];
  status: string;
}

interface FeaturedProduct {
  name: string;
  original_price: number;
  sale_price: number;
  savings: number;
  status: string;
  tag: string;
}

interface ResultData {
  categories: {
    electronics: {
      phones: ProductFeature[];
      laptops: ProductFeature[];
      accessories: ProductFeature[];
    };
    clothing: {
      mens: {
        shirts: ProductFeature[];
        pants: ProductFeature[];
      };
      womens: {
        dresses: ProductFeature[];
        tops: ProductFeature[];
      };
    };
  };
  featured_products: FeaturedProduct[];
}

class CustomHttpClient implements BaseHttpClient {
  async sendRequest<TResponseType extends keyof ResponseTypes = "text">(
    request: HttpRequest<TResponseType>,
  ): Promise<HttpResponse<TResponseType>> {
    const { url, method = "GET", headers = {}, payload } = request;

    const options: RequestInit = {
      method,
      headers: headers ? new Headers(headers as HeadersInit) : undefined,
      body: payload ? JSON.stringify(payload) : undefined,
    };

    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type") || "";

    let responseBody: any;
    if (
      request.responseType === "json" ||
      contentType.includes("application/json")
    ) {
      responseBody = await response.json();
    } else if (request.responseType === "buffer") {
      const arrayBuffer = await response.arrayBuffer();
      responseBody = Buffer.from(arrayBuffer);
    } else {
      responseBody = await response.text();
    }

    return {
      url: response.url,
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseBody as any,
      request,
      redirectUrls: [],
      trailers: {},
      complete: true,
    };
  }

  async stream(
    request: HttpRequest,
    _onRedirect?: RedirectHandler,
  ): Promise<StreamingHttpResponse> {
    // Simple implementation that fetches the content and converts it to a stream
    const response = await fetch(request.url, {
      method: request.method || "GET",
      headers: request.headers
        ? new Headers(request.headers as HeadersInit)
        : undefined,
      body: request.payload ? JSON.stringify(request.payload) : undefined,
    });

    // Create a readable stream from the response body
    const responseBody = await response.arrayBuffer();
    const buffer = Buffer.from(responseBody);
    const nodeStream = Readable.from(buffer);

    // Create StreamingHttpResponse object
    const streamingResponse: StreamingHttpResponse = {
      url: response.url,
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      request,
      stream: nodeStream,
      complete: true,
      downloadProgress: {
        percent: 100,
        transferred: buffer.length,
        total: buffer.length,
      },
      uploadProgress: { percent: 0, transferred: 0 },
      redirectUrls: [],
      trailers: {},
    };

    return streamingResponse;
  }
}

// Create a new instance of the CheerioCrawler
log.setLevel(LogLevel.OFF);
const crawler = new CheerioCrawler({
  httpClient: new CustomHttpClient(), // work-around to be able to run via deno

  // This function will be called for each URL to crawl
  async requestHandler({ $, request, enqueueLinks, pushData, log }) {
    // TODO: Implement
  },
  maxRequestsPerCrawl: 50, // Limit the crawler to prevent infinite loops
  log,
});

// Main function to run the crawler and process results
async function main() {
  // Start with the home page
  await crawler.run([URI]);

  // Process the crawled data to create the final result structure
  const items = await crawler.getData();

  const result: ResultData = {
    categories: {
      electronics: {
        phones: [],
        laptops: [],
        accessories: [],
      },
      clothing: {
        mens: {
          shirts: [],
          pants: [],
        },
        womens: {
          dresses: [],
          tops: [],
        },
      },
    },
    featured_products: [],
  };

  // Process each item and build the final structure
  for (const item of items.items) {
    if (item.type === "phones") {
      result.categories.electronics.phones = item.data;
    } else if (item.type === "laptops") {
      result.categories.electronics.laptops = item.data;
    } else if (item.type === "accessories") {
      result.categories.electronics.accessories = item.data;
    } else if (item.type === "mens") {
      result.categories.clothing.mens = item.data;
    } else if (item.type === "womens") {
      result.categories.clothing.womens = item.data;
    } else if (item.type === "featured") {
      result.featured_products = item.data;
    }
  }

  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
