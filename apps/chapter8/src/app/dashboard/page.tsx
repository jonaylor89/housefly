"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "react-toastify";

type SavedSearch = {
  id: string;
  destination: string;
  startDate: string | null;
  endDate: string | null;
  priceMin: number | null;
  priceMax: number | null;
  amenities: string[] | null;
  createdAt: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // Fetch saved searches if authenticated
    if (status === "authenticated") {
      const fetchSavedSearches = async () => {
        try {
          const response = await fetch("/api/user/searches");

          if (response.ok) {
            const data = await response.json();
            setSavedSearches(data.searches);
          } else {
            console.error("Failed to fetch saved searches");
            toast.error("Failed to load your saved searches");
          }
        } catch (error) {
          console.error("Error fetching saved searches:", error);
          toast.error("An error occurred while loading your data");
        } finally {
          setIsLoading(false);
        }
      };

      fetchSavedSearches();
    }
  }, [status, router]);

  const handleDeleteSearch = async (searchId: string) => {
    try {
      const response = await fetch(`/api/user/searches/${searchId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSavedSearches((prev) =>
          prev.filter((search) => search.id !== searchId),
        );
        toast.success("Search deleted successfully");
      } else {
        toast.error("Failed to delete search");
      }
    } catch (error) {
      console.error("Error deleting search:", error);
      toast.error("An error occurred while deleting the search");
    }
  };

  // For loading state or not authenticated
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {session?.user?.name || "Traveler"}!
        </h1>
        <p className="text-gray-600">
          Manage your profile and view your saved travel searches.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Saved Searches</h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : savedSearches.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              You don&apos;t have any saved searches yet.
            </p>
            <Link href="/search" className="btn btn-primary">
              Start a New Search
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="border rounded-md p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">
                      {search.destination}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      {search.startDate && search.endDate ? (
                        <p>
                          {format(new Date(search.startDate), "MMM d, yyyy")} -{" "}
                          {format(new Date(search.endDate), "MMM d, yyyy")}
                        </p>
                      ) : (
                        <p>No dates specified</p>
                      )}

                      {search.priceMin && search.priceMax ? (
                        <p>
                          Price range: ${search.priceMin} - ${search.priceMax}
                        </p>
                      ) : (
                        <p>No price range specified</p>
                      )}

                      {search.amenities && search.amenities.length > 0 ? (
                        <p>Amenities: {search.amenities.join(", ")}</p>
                      ) : (
                        <p>No amenities specified</p>
                      )}

                      <p className="mt-1 text-xs">
                        Saved on{" "}
                        {format(
                          new Date(search.createdAt),
                          "MMM d, yyyy 'at' h:mm a",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      href={`/search?id=${search.id}`}
                      className="btn btn-secondary text-sm px-3 py-1"
                    >
                      Load Search
                    </Link>
                    <button
                      onClick={() => handleDeleteSearch(search.id)}
                      className="btn btn-danger text-sm px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
