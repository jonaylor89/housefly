import { NextResponse } from "next/server";
import { mockProducts } from "@/data/products";
// import type { Product } from "@/types/product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const category = searchParams.get("category");
  const sortBy = searchParams.get("sortBy") || "id"; // Default sort
  const sortOrder = searchParams.get("sortOrder") || "asc"; // Default order
  const minPrice = parseFloat(searchParams.get("minPrice") || "0");
  const maxPrice = parseFloat(searchParams.get("maxPrice") || "Infinity");

  // --- Filtering ---
  const filteredProducts = mockProducts.filter((product) => {
    const categoryMatch =
      !category || category === "All" || product.category === category;
    const priceMatch = product.price >= minPrice && product.price <= maxPrice;
    return categoryMatch && priceMatch;
  });

  // --- Sorting ---
  filteredProducts.sort((a, b) => {
    let comparison = 0;
    const valA =
      sortBy === "price" ? a.price : sortBy === "rating" ? a.rating.rate : a.id;
    const valB =
      sortBy === "price" ? b.price : sortBy === "rating" ? b.rating.rate : b.id;

    if (valA < valB) {
      comparison = -1;
    } else if (valA > valB) {
      comparison = 1;
    }
    return sortOrder === "desc" ? comparison * -1 : comparison;
  });

  // --- Pagination ---
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay

  return NextResponse.json({
    products: paginatedProducts,
    currentPage: page,
    totalPages: totalPages,
    totalProducts: totalProducts,
  });
}
