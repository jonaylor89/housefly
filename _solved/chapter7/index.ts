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
  // TODO: Implement product scraping logic here
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
