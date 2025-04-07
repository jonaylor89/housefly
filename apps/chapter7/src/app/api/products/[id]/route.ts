import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/data/products";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  const { id } = await params;

  if (isNaN(id)) {
    return NextResponse.json(
      { message: "Invalid product ID" },
      { status: 400 },
    );
  }

  const product = mockProducts.find((p) => p.id === id);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms delay

  if (product) {
    return NextResponse.json(product);
  } else {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
}
