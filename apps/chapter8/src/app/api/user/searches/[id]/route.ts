import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";

// GET a specific saved search by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: searchId } = await params;

    const search = await prisma.search.findUnique({
      where: { id: searchId },
    });

    if (!search) {
      return NextResponse.json(
        { message: "Search not found" },
        { status: 404 },
      );
    }

    // Ensure the search belongs to the current user
    if (search.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse amenities if they exist
    const parsedSearch = {
      ...search,
      amenities: search.amenities
        ? JSON.parse(search.amenities as string)
        : null,
    };

    return NextResponse.json(parsedSearch);
  } catch (error) {
    console.error("Error fetching search:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE a saved search
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: searchId } = await params;

    // First, check if the search exists and belongs to the user
    const search = await prisma.search.findUnique({
      where: { id: searchId },
    });

    if (!search) {
      return NextResponse.json(
        { message: "Search not found" },
        { status: 404 },
      );
    }

    if (search.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Delete the search
    await prisma.search.delete({
      where: { id: searchId },
    });

    return NextResponse.json(
      { message: "Search deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting search:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
