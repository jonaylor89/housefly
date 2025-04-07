"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Product, PaginatedResponse } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import LoadingSpinner from "@/components/LoadingSpinner";
import Filters, { FilterState } from "@/components/Filters";

const initialFilterState: FilterState = {
  category: "All",
  sortBy: "id",
  sortOrder: "asc",
  minPrice: "",
  maxPrice: "",
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10", // Or make this configurable
        category: filters.category,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PaginatedResponse = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      // Ensure currentPage doesn't exceed new totalPages after filtering
      if (currentPage > data.totalPages) {
        setCurrentPage(data.totalPages > 0 ? data.totalPages : 1);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to fetch products.");
      setProducts([]); // Clear products on error
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]); // Dependency array includes currentPage and filters

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // fetchProducts is stable due to useCallback

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optional: Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Product Catalog</h1>

      <Filters initialFilters={filters} onFilterChange={handleFilterChange} />

      {isLoading && <LoadingSpinner />}
      {error && <p className="text-red-500 text-center my-4">Error: {error}</p>}

      {!isLoading && !error && products.length === 0 && (
        <p className="text-center text-gray-500 my-4">
          No products found matching your criteria.
        </p>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!isLoading && !error && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}
