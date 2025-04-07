type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

type PaginatedResponse = {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
};

const BASE_URL = "https://chapter7.housefly.cc";
const PAGE_LIMIT = 10;

/**
 * Helper function to safely format a value for CSV, quoting strings
 * and escaping existing quotes within strings.
 */
function formatCsvValue(value: any): string {
  if (value === null || value === undefined) {
    return "";
  }
  const stringValue = String(value);

  return `"${stringValue.replace(/"/g, '""')}"`;
}

async function scrapeAllProducts(): Promise<Product[]> {
  let currentPage = 1;
  let totalPages = 1; // Initialize to 1 to ensure the loop runs at least once
  const allProducts: Product[] = [];
  let isFirstPage = true;

  console.error("Starting scrape..."); // Log progress to stderr

  try {
    while (currentPage <= totalPages) {
      const url = `${BASE_URL}/api/products?page=${currentPage}&limit=${PAGE_LIMIT}`;
      console.error(
        `Fetching page ${currentPage} of ${totalPages}... URL: ${url}`,
      ); // Log progress

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for ${url}`);
      }

      const data: PaginatedResponse = await response.json();

      if (isFirstPage) {
        totalPages = data.totalPages; // Get total pages from the first response
        console.error(`Total pages found: ${totalPages}`);
        isFirstPage = false;
        if (totalPages === 0) {
          console.error("API returned 0 total pages. No products to fetch.");
          break; // Exit if no products
        }
      }

      if (data.products && data.products.length > 0) {
        allProducts.push(...data.products);
      } else if (currentPage <= totalPages) {
        // If API reports pages but returns empty array for a valid page number
        console.error(
          `Warning: Page ${currentPage} returned no products, but totalPages is ${totalPages}. Stopping pagination.`,
        );
        break; // Stop fetching if a page within range is empty
      }

      currentPage++;

      // Optional delay to be polite to the server, even if local
      // await new Promise(resolve => setTimeout(resolve, 50)); // 50ms delay
    }

    console.error(
      `Scraping finished. Total products fetched: ${allProducts.length}`,
    );
    return allProducts;
  } catch (error) {
    console.error("Error during scraping:", error);
    throw error; // Re-throw error after logging
  }
}

async function main() {
  const products = await scrapeAllProducts();

  // Print CSV Header to stdout
  console.log(
    "id,name,price,description,category,image,rating_rate,rating_count",
  );

  // Print each product as a CSV row to stdout
  products.forEach((product) => {
    const csvRow = [
      product.id,
      formatCsvValue(product.name),
      product.price,
      formatCsvValue(product.description),
      formatCsvValue(product.category),
      formatCsvValue(product.image),
      product.rating.rate,
      product.rating.count,
    ].join(",");
    console.log(csvRow);
  });
}

main().catch(console.error);
