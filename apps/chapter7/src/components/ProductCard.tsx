import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link
      href={`/products/${product.id}`}
      className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-200 block"
    >
      <div className="relative h-48 w-full">
        {/* Provide explicit width/height or use fill with sizes */}
        <Image
          src={product.image || "/images/placeholder.jpg"} // Fallback image
          alt={product.name}
          layout="fill" // Or specify width/height
          objectFit="cover" // Adjust as needed
          className="bg-gray-200" // Background while loading
          unoptimized={!product.image || product.image.startsWith("http")} // Don't optimize external or placeholder URLs if needed
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate mb-1">{product.name}</h3>
        <p className="text-gray-800 font-bold mb-1">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">
          Rating: {product.rating.rate} ({product.rating.count} reviews)
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
