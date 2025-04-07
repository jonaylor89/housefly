"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id; // id will be a string or undefined

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== "string") {
      setError("Invalid product ID.");
      setIsLoading(false);
      return; // Don't fetch if ID is missing or invalid
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.status === 404) {
          throw new Error("Product not found.");
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product = await response.json();
        setProduct(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Failed to fetch product details.");
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Re-run effect if id changes

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <p className="text-red-500 text-center my-8">Error: {error}</p>;
  if (!product)
    return (
      <p className="text-center text-gray-500 my-8">
        Product data not available.
      </p>
    ); // Should be covered by error mostly

  return (
    <main className="container mx-auto p-4 md:p-8">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        &larr; Back to Catalog
      </Link>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 relative aspect-square">
          <Image
            src={product.image || "/images/placeholder.jpg"}
            alt={product.name}
            layout="fill"
            objectFit="contain" // 'contain' might be better for detail view
            className="rounded-lg bg-gray-100"
            unoptimized={!product.image || product.image.startsWith("http")}
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-gray-600 mb-4 text-sm bg-gray-100 inline-block px-2 py-1 rounded">
            {product.category}
          </p>
          <p className="text-2xl font-semibold text-gray-900 mb-4">
            ${product.price.toFixed(2)}
          </p>
          <div className="mb-4">
            <span className="text-yellow-500">
              {"★".repeat(Math.round(product.rating.rate))}
              {"☆".repeat(5 - Math.round(product.rating.rate))}
            </span>
            <span className="ml-2 text-sm text-gray-600">
              {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed mb-6">
            {product.description}
          </p>
          {/* Add more details or buttons as needed */}
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Add to Cart (Dummy)
          </button>
        </div>
      </div>
    </main>
  );
}
