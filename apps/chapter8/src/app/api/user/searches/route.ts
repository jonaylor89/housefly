import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// GET all saved searches for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const searches = await prisma.search.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ searches });
  } catch (error) {
    console.error("Error fetching searches:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST a new saved search
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { destination, startDate, endDate, priceMin, priceMax, amenities } = await request.json();

    if (!destination) {
      return NextResponse.json(
        { message: "Destination is required" },
        { status: 400 }
      );
    }

    // Create the saved search
    const savedSearch = await prisma.search.create({
      data: {
        userId: session.user.id,
        destination,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        priceMin,
        priceMax,
        amenities: amenities ? JSON.stringify(amenities) : null,
      },
    });

    return NextResponse.json(
      { message: "Search saved successfully", id: savedSearch.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving search:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}