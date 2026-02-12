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

const URI = "http://localhost:3006";

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
  httpClient: new CustomHttpClient(),

  // This function will be called for each URL to crawl
  async requestHandler({ $, request, enqueueLinks, pushData, log }) {
    // Home page - just enqueue links
    if (request.url.endsWith("/index.html") || request.url.endsWith("/")) {
      await enqueueLinks({
        selector: "nav a",
        baseUrl: request.loadedUrl,
      });
      return;
    }

    // Electronics -> Phones page
    if (request.url.includes("/products/electronics/phones.html")) {
      const phones: ProductFeature[] = [];

      // Get all product cards
      $(".product-card").each((_, card) => {
        const name = $(card).find(".product-name").text().trim();
        const priceText = $(card)
          .find(".product-price")
          .text()
          .replace("$", "")
          .replace(",", "")
          .trim();
        const price = parseFloat(priceText);

        // Parse rating
        const ratingText = $(card).find(".product-rating").text().trim();
        const stars = ratingText.split(" ")[0].length;
        // Handle half stars (★★★★½)
        const score = ratingText.includes("½") ? stars - 0.5 : stars;
        const reviewCountMatch = ratingText.match(/\((\d+) reviews\)/);
        const reviewCount = reviewCountMatch
          ? parseInt(reviewCountMatch[1])
          : 0;

        // Parse features
        const features: string[] = [];
        $(card)
          .find(".product-specs li")
          .each((_, li) => {
            features.push($(li).text().trim());
          });

        // Parse stock status
        const status = $(card).find(".stock-status").text().trim();

        phones.push({
          name,
          price,
          rating: {
            score,
            count: reviewCount,
          },
          features,
          status,
        });
      });

      await pushData({
        type: "phones",
        data: phones,
      });
    }

    // Electronics -> Laptops page
    if (request.url.includes("/products/electronics/laptops.html")) {
      const laptops: ProductFeature[] = [];

      $(".product-card").each((_, card) => {
        const name = $(card).find(".product-name").text().trim();
        const priceText = $(card)
          .find(".product-price")
          .text()
          .replace("$", "")
          .replace(",", "")
          .trim();
        const price = parseFloat(priceText);

        // Parse rating
        const ratingText = $(card).find(".product-rating").text().trim();
        const stars = ratingText.split(" ")[0].length;
        const score = ratingText.includes("½") ? stars - 0.5 : stars;
        const reviewCountMatch = ratingText.match(/\((\d+) reviews\)/);
        const reviewCount = reviewCountMatch
          ? parseInt(reviewCountMatch[1])
          : 0;

        // Parse features
        const features: string[] = [];
        $(card)
          .find(".product-specs li")
          .each((_, li) => {
            features.push($(li).text().trim());
          });

        // Parse stock status
        const status = $(card).find(".stock-status").text().trim();

        laptops.push({
          name,
          price,
          rating: {
            score,
            count: reviewCount,
          },
          features,
          status,
        });
      });

      await pushData({
        type: "laptops",
        data: laptops,
      });
    }

    // Electronics -> Accessories page
    if (request.url.includes("/products/electronics/accessories.html")) {
      const accessories: ProductFeature[] = [];

      $(".product-card").each((_, card) => {
        const name = $(card).find(".product-name").text().trim();
        const priceText = $(card)
          .find(".product-price")
          .text()
          .replace("$", "")
          .replace(",", "")
          .trim();
        const price = parseFloat(priceText);

        // Parse rating
        const ratingText = $(card).find(".product-rating").text().trim();
        const stars = ratingText.split(" ")[0].length;
        const score = ratingText.includes("½") ? stars - 0.5 : stars;
        const reviewCountMatch = ratingText.match(/\((\d+) reviews\)/);
        const reviewCount = reviewCountMatch
          ? parseInt(reviewCountMatch[1])
          : 0;

        // Parse features
        const features: string[] = [];
        $(card)
          .find(".product-specs li")
          .each((_, li) => {
            features.push($(li).text().trim());
          });

        // Parse stock status
        const status = $(card).find(".stock-status").text().trim();

        accessories.push({
          name,
          price,
          rating: {
            score,
            count: reviewCount,
          },
          features,
          status,
        });
      });

      await pushData({
        type: "accessories",
        data: accessories,
      });
    }

    // Men's clothing page
    if (request.url.includes("/products/clothing/mens.html")) {
      const shirts: ProductFeature[] = [];
      $("#shirts .product-card").each((_, card) => {
        const name = $(card).find(".product-name").text().trim();
        const priceText = $(card)
          .find(".product-price")
          .text()
          .replace("$", "")
          .replace(",", "")
          .trim();
        const price = parseFloat(priceText);

        const ratingText = $(card).find(".product-rating").text().trim();
        const stars = ratingText.split(" ")[0].length;
        const score = ratingText.includes("½") ? stars - 0.5 : stars;
        const reviewCountMatch = ratingText.match(/\((\d+) reviews\)/);
        const reviewCount = reviewCountMatch
          ? parseInt(reviewCountMatch[1])
          : 0;

        const features: string[] = [];
        $(card)
          .find(".product-specs li")
          .each((_, li) => {
            features.push($(li).text().trim());
          });

        const status = $(card).find(".stock-status").text().trim();

        shirts.push({
          name,
          price,
          rating: {
            score,
            count: reviewCount,
          },
          features,
          status,
        });
      });

      // Extract pants (first 2)
      const pants: ProductFeature[] = [];
      $("#pants .product-card").each((_, card) => {
        const name = $(card).find(".product-name").text().trim();
        const priceText = $(card)
          .find(".product-price")
          .text()
          .replace("$", "")
          .replace(",", "")
          .trim();
        const price = parseFloat(priceText);

        const ratingText = $(card).find(".product-rating").text().trim();
        const stars = ratingText.split(" ")[0].length;
        const score = ratingText.includes("½") ? stars - 0.5 : stars;
        const reviewCountMatch = ratingText.match(/\((\d+) reviews\)/);
        const reviewCount = reviewCountMatch
          ? parseInt(reviewCountMatch[1])
          : 0;

        const features: string[] = [];
        $(card)
          .find(".product-specs li")
          .each((_, li) => {
            features.push($(li).text().trim());
          });

        const status = $(card).find(".stock-status").text().trim();

        pants.push({
          name,
          price,
          rating: {
            score,
            count: reviewCount,
          },
          features,
          status,
        });
      });

      await pushData({
        type: "mens",
        data: {
          shirts,
          pants,
        },
      });
    }

    // Women's clothing page
    if (request.url.includes("/products/clothing/womens.html")) {
      const dresses: ProductFeature[] = [];
      $("#dresses .product-card").each((_, card) => {
        const name = $(card).find(".product-name").text().trim();
        const priceText = $(card)
          .find(".product-price")
          .text()
          .replace("$", "")
          .replace(",", "")
          .trim();
        const price = parseFloat(priceText);

        const ratingText = $(card).find(".product-rating").text().trim();
        const stars = ratingText.split(" ")[0].length;
        const score = ratingText.includes("½") ? stars - 0.5 : stars;
        const reviewCountMatch = ratingText.match(/\((\d+) reviews\)/);
        const reviewCount = reviewCountMatch
          ? parseInt(reviewCountMatch[1])
          : 0;

        const features: string[] = [];
        $(card)
          .find(".product-specs li")
          .each((_, li) => {
            features.push($(li).text().trim());
          });

        const status = $(card).find(".stock-status").text().trim();

        dresses.push({
          name,
          price,
          rating: {
            score,
            count: reviewCount,
          },
          features,
          status,
        });
      });

      const tops: ProductFeature[] = [];
      $("#tops .product-card").each((_, card) => {
        const name = $(card).find(".product-name").text().trim();
        const priceText = $(card)
          .find(".product-price")
          .text()
          .replace("$", "")
          .replace(",", "")
          .trim();
        const price = parseFloat(priceText);

        const ratingText = $(card).find(".product-rating").text().trim();
        const stars = ratingText.split(" ")[0].length;
        const score = ratingText.includes("½") ? stars - 0.5 : stars;
        const reviewCountMatch = ratingText.match(/\((\d+) reviews\)/);
        const reviewCount = reviewCountMatch
          ? parseInt(reviewCountMatch[1])
          : 0;

        const features: string[] = [];
        $(card)
          .find(".product-specs li")
          .each((_, li) => {
            features.push($(li).text().trim());
          });

        const status = $(card).find(".stock-status").text().trim();

        tops.push({
          name,
          price,
          rating: {
            score,
            count: reviewCount,
          },
          features,
          status,
        });
      });

      await pushData({
        type: "womens",
        data: {
          dresses,
          tops,
        },
      });
    }

    // Featured products page
    if (request.url.includes("/products/featured.html")) {
      const featuredProducts: FeaturedProduct[] = [];

      $(".product-card").each((_, card) => {
        const name = $(card).find(".product-name").text().trim();
        const tagText = $(card).find(".featured-tag").text().trim();

        const originalPriceText = $(card)
          .find(".original-price")
          .text()
          .replace("$", "")
          .replace(",", "")
          .trim();
        const originalPrice = parseFloat(originalPriceText);

        const salePriceText = $(card)
          .find(".product-price")
          .text()
          .replace("$", "")
          .replace(",", "")
          .trim();
        const salePrice = parseFloat(salePriceText);

        const savings = parseFloat((originalPrice - salePrice).toFixed(2));

        const status = $(card).find(".stock-status").text().trim();

        featuredProducts.push({
          name,
          original_price: originalPrice,
          sale_price: salePrice,
          savings,
          status,
          tag: tagText,
        });
      });

      await pushData({
        type: "featured",
        data: featuredProducts,
      });
    }

    // Continue crawling
    await enqueueLinks({
      selector: "a",
      baseUrl: request.loadedUrl,
    });
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
