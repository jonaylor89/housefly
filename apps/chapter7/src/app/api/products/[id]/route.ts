import { NextRequest, NextResponse } from "next/server";
import { mockProducts } from "@/data/products";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idNum = parseInt(id);

  if (isNaN(idNum)) {
    return NextResponse.json(
      { message: "Invalid product ID" },
      { status: 400 },
    );
  }

  console.log({ id });

  const product = mockProducts.find((p) => p.id === idNum);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300)); // 300ms delay

  if (product) {
    return NextResponse.json(product);
  } else {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
}
