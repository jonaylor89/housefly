import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3007;
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const PUBLIC_DIR = join(__dirname, "public");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

const products: Product[] = [
  { id: 1, name: "Classic T-Shirt", price: 19.99, description: "A comfortable and stylish classic t-shirt.", category: "Apparel", image: "https://picsum.photos/seed/1/400/400", rating: { rate: 4.5, count: 120 } },
  { id: 2, name: "Wireless Headphones", price: 89.99, description: "High-quality sound without the wires.", category: "Electronics", image: "https://picsum.photos/seed/2/400/400", rating: { rate: 4.8, count: 250 } },
  { id: 3, name: "Coffee Mug", price: 12.50, description: "The perfect mug for your morning coffee.", category: "Home Goods", image: "https://picsum.photos/seed/3/400/400", rating: { rate: 4.2, count: 85 } },
  { id: 4, name: "Running Shoes", price: 120.00, description: "Lightweight shoes for your daily run.", category: "Apparel", image: "https://picsum.photos/seed/4/400/400", rating: { rate: 4.6, count: 180 } },
  { id: 5, name: "Smartwatch", price: 199.99, description: "Track your fitness and stay connected.", category: "Electronics", image: "https://picsum.photos/seed/5/400/400", rating: { rate: 4.7, count: 310 } },
  { id: 6, name: "Yoga Mat", price: 29.99, description: "Non-slip mat for your yoga practice.", category: "Sports", image: "https://picsum.photos/seed/6/400/400", rating: { rate: 4.4, count: 110 } },
  { id: 7, name: "Bluetooth Speaker", price: 59.99, description: "Portable speaker with great sound.", category: "Electronics", image: "https://picsum.photos/seed/7/400/400", rating: { rate: 4.6, count: 150 } },
  { id: 8, name: "Denim Jeans", price: 55.00, description: "Classic fit denim jeans.", category: "Apparel", image: "https://picsum.photos/seed/8/400/400", rating: { rate: 4.3, count: 90 } },
  { id: 9, name: "Water Bottle", price: 15.99, description: "Insulated stainless steel water bottle.", category: "Home Goods", image: "https://picsum.photos/seed/9/400/400", rating: { rate: 4.9, count: 300 } },
  { id: 10, name: "Backpack", price: 75.00, description: "Durable backpack for everyday use.", category: "Accessories", image: "https://picsum.photos/seed/10/400/400", rating: { rate: 4.5, count: 220 } },
  { id: 11, name: "Gaming Mouse", price: 49.99, description: "High-precision mouse for gaming.", category: "Electronics", image: "https://picsum.photos/seed/11/400/400", rating: { rate: 4.7, count: 190 } },
  { id: 12, name: "Hoodie", price: 39.99, description: "Warm and comfortable hoodie.", category: "Apparel", image: "https://picsum.photos/seed/12/400/400", rating: { rate: 4.4, count: 130 } },
  { id: 13, name: "Throw Pillow", price: 24.50, description: "Decorative pillow for your couch.", category: "Home Goods", image: "https://picsum.photos/seed/13/400/400", rating: { rate: 4.1, count: 70 } },
  { id: 14, name: "Sunglasses", price: 65.00, description: "Stylish sunglasses with UV protection.", category: "Accessories", image: "https://picsum.photos/seed/14/400/400", rating: { rate: 4.6, count: 140 } },
  { id: 15, name: "Keyboard", price: 110.00, description: "Mechanical keyboard for typing.", category: "Electronics", image: "https://picsum.photos/seed/15/400/400", rating: { rate: 4.8, count: 280 } },
  { id: 16, name: "Sneakers", price: 95.00, description: "Casual sneakers for everyday wear.", category: "Apparel", image: "https://picsum.photos/seed/16/400/400", rating: { rate: 4.5, count: 160 } },
  { id: 17, name: "Wall Clock", price: 35.00, description: "Modern design wall clock.", category: "Home Goods", image: "https://picsum.photos/seed/17/400/400", rating: { rate: 4.2, count: 90 } },
  { id: 18, name: "Dumbbells Set", price: 80.00, description: "Adjustable dumbbells for home workouts.", category: "Sports", image: "https://picsum.photos/seed/18/400/400", rating: { rate: 4.7, count: 200 } },
  { id: 19, name: "External Hard Drive", price: 99.99, description: "1TB external hard drive for backups.", category: "Electronics", image: "https://picsum.photos/seed/19/400/400", rating: { rate: 4.6, count: 240 } },
  { id: 20, name: "Beanie Hat", price: 18.00, description: "Warm beanie for cold weather.", category: "Apparel", image: "https://picsum.photos/seed/20/400/400", rating: { rate: 4.3, count: 100 } },
  { id: 21, name: "Blender", price: 69.99, description: "High-speed blender for smoothies.", category: "Home Goods", image: "https://picsum.photos/seed/21/400/400", rating: { rate: 4.5, count: 170 } },
  { id: 22, name: "Watch", price: 150.00, description: "Classic analog watch.", category: "Accessories", image: "https://picsum.photos/seed/22/400/400", rating: { rate: 4.7, count: 210 } },
  { id: 23, name: "Webcam", price: 35.99, description: "HD webcam for video calls.", category: "Electronics", image: "https://picsum.photos/seed/23/400/400", rating: { rate: 4.4, count: 135 } },
  { id: 24, name: "Dress Shirt", price: 48.00, description: "Formal dress shirt.", category: "Apparel", image: "https://picsum.photos/seed/24/400/400", rating: { rate: 4.2, count: 80 } },
  { id: 25, name: "Desk Lamp", price: 45.00, description: "Brighten up your workspace.", category: "Home Goods", image: "https://picsum.photos/seed/25/400/400", rating: { rate: 4.3, count: 95 } },
  { id: 26, name: "Resistance Bands", price: 22.99, description: "Set of resistance bands for exercise.", category: "Sports", image: "https://picsum.photos/seed/26/400/400", rating: { rate: 4.5, count: 125 } },
  { id: 27, name: "Monitor", price: 250.00, description: "27-inch computer monitor.", category: "Electronics", image: "https://picsum.photos/seed/27/400/400", rating: { rate: 4.7, count: 320 } },
  { id: 28, name: "Winter Jacket", price: 130.00, description: "Insulated jacket for winter.", category: "Apparel", image: "https://picsum.photos/seed/28/400/400", rating: { rate: 4.6, count: 195 } },
  { id: 29, name: "Picture Frame", price: 14.99, description: "Simple wooden picture frame.", category: "Home Goods", image: "https://picsum.photos/seed/29/400/400", rating: { rate: 4.0, count: 60 } },
  { id: 30, name: "Leather Wallet", price: 40.00, description: "Genuine leather wallet.", category: "Accessories", image: "https://picsum.photos/seed/30/400/400", rating: { rate: 4.8, count: 260 } },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jsonResponse(res: import("node:http").ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

createServer(async (req, res) => {
  const parsed = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  const pathname = parsed.pathname;

  // GET /api/products/:id
  const idMatch = pathname.match(/^\/api\/products\/(\d+)$/);
  if (idMatch) {
    await delay(300);
    const id = parseInt(idMatch[1], 10);
    const product = products.find((p) => p.id === id);
    if (product) {
      jsonResponse(res, 200, product);
    } else {
      jsonResponse(res, 404, { message: "Product not found" });
    }
    return;
  }

  // GET /api/products
  if (pathname === "/api/products") {
    await delay(500);

    const params = parsed.searchParams;
    const page = parseInt(params.get("page") ?? "1", 10);
    const limit = parseInt(params.get("limit") ?? "10", 10);
    const category = params.get("category") ?? undefined;
    const sortBy = params.get("sortBy") ?? "id";
    const sortOrder = params.get("sortOrder") ?? "asc";
    const minPrice = parseFloat(params.get("minPrice") ?? "0");
    const maxPrice = params.get("maxPrice") ? parseFloat(params.get("maxPrice")!) : Infinity;

    let filtered = products.filter((p) => {
      if (category && category !== "All" && p.category !== category) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    });

    filtered = [...filtered].sort((a, b) => {
      let aVal: number;
      let bVal: number;
      if (sortBy === "price") {
        aVal = a.price;
        bVal = b.price;
      } else if (sortBy === "rating") {
        aVal = a.rating.rate;
        bVal = b.rating.rate;
      } else {
        aVal = a.id;
        bVal = b.id;
      }
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

    const totalProducts = filtered.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    jsonResponse(res, 200, {
      products: paged,
      currentPage: page,
      totalPages,
      totalProducts,
    });
    return;
  }

  // Static file serving from public/
  let filePath = pathname;
  if (filePath.endsWith("/")) filePath += "index.html";

  const fullPath = join(PUBLIC_DIR, filePath);

  if (!fullPath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const data = await readFile(fullPath);
    const ext = extname(fullPath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(PORT, () => {
  console.log(`Chapter 7 server running on http://localhost:${PORT}`);
});
