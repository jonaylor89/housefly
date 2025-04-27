"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

// Step types for our multi-step form
type FormStep = "destination" | "dates" | "filters" | "results";

// Search form data type
type SearchFormData = {
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  priceMin: number;
  priceMax: number;
  amenities: string[];
};

// Listing type
type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  amenities: string[];
  isPremium: boolean;
  destinationId: string;
};

// Mock destinations for autocomplete
const DESTINATIONS = [
  "Paris, France",
  "Tokyo, Japan",
  "New York, USA",
  "London, UK",
  "Rome, Italy",
  "Sydney, Australia",
  "Barcelona, Spain",
  "Dubai, UAE",
  "Bangkok, Thailand",
  "Cape Town, South Africa",
];

// Available amenities
const AMENITIES = [
  "Wi-Fi",
  "Pool",
  "Gym",
  "Breakfast",
  "Air conditioning",
  "Parking",
  "Restaurant",
  "Room service",
  "Spa",
  "Pet friendly",
];

export default function SearchPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = status === "authenticated";

  // Current step in the multi-step form
  const [currentStep, setCurrentStep] = useState<FormStep>("destination");

  // Form data
  const [formData, setFormData] = useState<SearchFormData>({
    destination: "",
    startDate: null,
    endDate: null,
    priceMin: 0,
    priceMax: 1000,
    amenities: [],
  });

  // Autocomplete suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Search results
  const [searchResults, setSearchResults] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Saved search ID (if loading a saved search)
  const [savedSearchId, setSavedSearchId] = useState<string | null>(null);

  // Handle destination input change with autocomplete
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, destination: value }));

    // Filter destinations for autocomplete
    if (value.length > 1) {
      const filtered = DESTINATIONS.filter((dest) =>
        dest.toLowerCase().includes(value.toLowerCase()),
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Select suggestion from autocomplete
  const selectSuggestion = (suggestion: string) => {
    setFormData((prev) => ({ ...prev, destination: suggestion }));
    setShowSuggestions(false);
  };

  // Handle date changes
  const handleDateChange = (
    dates: [Date | null, Date | null] | Date | null,
  ) => {
    if (Array.isArray(dates)) {
      const [start, end] = dates;
      setFormData((prev) => ({ ...prev, startDate: start, endDate: end }));
    } else {
      // Single date selected
      setFormData((prev) => ({ ...prev, startDate: dates }));
    }
  };

  // Handle price range changes
  const handlePriceChange = useCallback(
    (type: "min" | "max", value: string) => {
      const numValue = parseInt(value);
      if (isNaN(numValue)) return;

      setFormData((prev) => ({
        ...prev,
        [type === "min" ? "priceMin" : "priceMax"]: numValue,
      }));
    },
    [],
  );

  // Handle amenity checkbox changes
  const handleAmenityChange = useCallback(
    (amenity: string, checked: boolean) => {
      setFormData((prev) => ({
        ...prev,
        amenities: checked
          ? [...prev.amenities, amenity]
          : prev.amenities.filter((a) => a !== amenity),
      }));
    },
    [],
  );

  // Move to next step in the form
  const goToNextStep = () => {
    switch (currentStep) {
      case "destination":
        if (!formData.destination) {
          toast.error("Please enter a destination");
          return;
        }
        setCurrentStep("dates");
        break;
      case "dates":
        // Dates are optional
        setCurrentStep("filters");
        break;
      case "filters":
        // Perform search and show results
        setCurrentStep("results");
        performSearch();
        break;
      default:
        break;
    }
  };

  // Go back to previous step
  const goToPreviousStep = () => {
    switch (currentStep) {
      case "dates":
        setCurrentStep("destination");
        break;
      case "filters":
        setCurrentStep("dates");
        break;
      case "results":
        setCurrentStep("filters");
        break;
      default:
        break;
    }
  };

  // Perform search and get results
  const performSearch = useCallback(async () => {
    setIsLoading(true);

    try {
      // In a real app, this would be an API call to a backend service
      // For this demo, we'll use a timeout to simulate an API call
      setTimeout(() => {
        // Generate mock results based on the search criteria
        const results: Listing[] = [
          {
            id: "1",
            title: `${formData.destination} Luxury Hotel`,
            description:
              "Experience luxury and comfort in this amazing hotel with stunning views.",
            price: 350,
            imageUrl: "/images/city.jpg",
            amenities: ["Wi-Fi", "Pool", "Spa", "Room service"],
            isPremium: true,
            destinationId: "1",
          },
          {
            id: "2",
            title: `${formData.destination} Budget Stay`,
            description: "Affordable accommodation in a convenient location.",
            price: 120,
            imageUrl: "/images/beach.jpg",
            amenities: ["Wi-Fi", "Breakfast"],
            isPremium: false,
            destinationId: "1",
          },
          {
            id: "3",
            title: `${formData.destination} Family Resort`,
            description:
              "Perfect for families with children, featuring kids club and activities.",
            price: 250,
            imageUrl: "/images/mountain.jpg",
            amenities: ["Wi-Fi", "Pool", "Parking", "Restaurant"],
            isPremium: false,
            destinationId: "1",
          },
          {
            id: "4",
            title: `${formData.destination} Executive Suite`,
            description:
              "High-end accommodations for business travelers with premium amenities.",
            price: 450,
            imageUrl: "/images/city.jpg",
            amenities: ["Wi-Fi", "Gym", "Room service", "Spa"],
            isPremium: true,
            destinationId: "1",
          },
        ];

        // Filter results based on price range
        let filtered = results.filter(
          (listing) =>
            listing.price >= formData.priceMin &&
            listing.price <= formData.priceMax,
        );

        // Filter by amenities if any are selected
        if (formData.amenities.length > 0) {
          filtered = filtered.filter((listing) =>
            formData.amenities.every((amenity) =>
              listing.amenities.includes(amenity),
            ),
          );
        }

        // Hide premium listings for non-authenticated users
        if (!isAuthenticated) {
          filtered = filtered.filter((listing) => !listing.isPremium);
        }

        setSearchResults(filtered);
        setIsLoading(false);
      }, 1500); // Simulate network delay
    } catch (error) {
      console.error("Search error:", error);
      toast.error("An error occurred during search");
      setIsLoading(false);
    }
  }, [
    formData.amenities,
    formData.destination,
    formData.priceMax,
    formData.priceMin,
    isAuthenticated,
  ]);

  // Load a saved search by ID
  const loadSavedSearch = useCallback(
    async (searchId: string) => {
      if (!isAuthenticated) {
        toast.error("Please log in to load saved searches");
        router.push("/login");
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/user/searches/${searchId}`);

        if (response.ok) {
          const data = await response.json();
          setFormData({
            destination: data.destination,
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            priceMin: data.priceMin ?? 0,
            priceMax: data.priceMax ?? 1000,
            amenities: data.amenities ?? [],
          });

          // Move to results and perform search
          setCurrentStep("results");
          performSearch();
        } else {
          toast.error("Failed to load saved search");
        }
      } catch (error) {
        console.error("Error loading saved search:", error);
        toast.error("An error occurred while loading your search");
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, performSearch, router],
  );

  // Save the current search to user profile
  const saveSearch = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to save searches");
      router.push("/login");
      return;
    }

    try {
      // Get CSRF token
      const csrfResponse = await fetch("/api/csrf");
      const { csrfToken } = await csrfResponse.json();

      const response = await fetch("/api/user/searches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          priceMin: formData.priceMin,
          priceMax: formData.priceMax,
          amenities: formData.amenities,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Search saved successfully");
        setSavedSearchId(data.id);
      } else {
        toast.error("Failed to save search");
      }
    } catch (error) {
      console.error("Error saving search:", error);
      toast.error("An error occurred while saving your search");
    }
  }, [
    formData.amenities,
    formData.destination,
    formData.endDate,
    formData.priceMax,
    formData.priceMin,
    formData.startDate,
    isAuthenticated,
    router,
  ]);

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case "destination":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Where do you want to go?</h2>
            <div className="relative">
              <label htmlFor="destination" className="label">
                Destination
              </label>
              <input
                id="destination"
                type="text"
                value={formData.destination}
                onChange={handleDestinationChange}
                placeholder="Enter city, country"
                className="input"
                autoComplete="off"
              />

              {/* Autocomplete suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button onClick={goToNextStep} className="btn btn-primary">
                Next: Select Dates
              </button>
            </div>
          </div>
        );

      case "dates":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">When are you traveling?</h2>
            <div>
              <label className="label">Select dates (optional)</label>
              <div className="bg-white border rounded-md p-4">
                <DatePicker
                  selected={formData.startDate}
                  onChange={handleDateChange}
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  selectsRange
                  inline
                  className="input"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {formData.startDate && formData.endDate
                  ? `Selected: ${formData.startDate.toLocaleDateString()} - ${formData.endDate.toLocaleDateString()}`
                  : "No dates selected"}
              </p>
            </div>

            <div className="flex justify-between">
              <button onClick={goToPreviousStep} className="btn btn-secondary">
                Back
              </button>
              <button onClick={goToNextStep} className="btn btn-primary">
                Next: Refine Search
              </button>
            </div>
          </div>
        );

      case "filters":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Refine your search</h2>

            <div>
              <label className="label">Price range ($ per night)</label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={formData.priceMin}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="input w-28"
                  min="0"
                />
                <span>to</span>
                <input
                  type="number"
                  value={formData.priceMax}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="input w-28"
                  min={formData.priceMin}
                />
              </div>
            </div>

            <div>
              <label className="label">Amenities</label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity}`}
                      checked={formData.amenities.includes(amenity)}
                      onChange={(e) =>
                        handleAmenityChange(amenity, e.target.checked)
                      }
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor={`amenity-${amenity}`}>{amenity}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={goToPreviousStep} className="btn btn-secondary">
                Back
              </button>
              <button onClick={goToNextStep} className="btn btn-primary">
                Search
              </button>
            </div>
          </div>
        );

      case "results":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Search Results</h2>

              <div className="flex items-center space-x-2">
                {!savedSearchId && isAuthenticated && (
                  <button
                    onClick={saveSearch}
                    className="btn btn-secondary text-sm"
                  >
                    Save this Search
                  </button>
                )}
                <button
                  onClick={goToPreviousStep}
                  className="btn btn-secondary text-sm"
                >
                  Modify Search
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Search criteria:</h3>
              <p>
                <span className="font-medium">Destination:</span>{" "}
                {formData.destination}
              </p>
              {formData.startDate && formData.endDate && (
                <p>
                  <span className="font-medium">Dates:</span>{" "}
                  {formData.startDate.toLocaleDateString()} -{" "}
                  {formData.endDate.toLocaleDateString()}
                </p>
              )}
              <p>
                <span className="font-medium">Price:</span> ${formData.priceMin}{" "}
                - ${formData.priceMax} per night
              </p>
              {formData.amenities.length > 0 && (
                <p>
                  <span className="font-medium">Amenities:</span>{" "}
                  {formData.amenities.join(", ")}
                </p>
              )}
            </div>

            {savedSearchId && (
              <div className="bg-green-50 p-4 rounded-md text-green-800">
                <p className="font-medium">
                  This search has been saved to your account!
                </p>
              </div>
            )}

            {!isAuthenticated && (
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-yellow-700 font-medium">
                  Some premium listings are only visible to logged-in users.
                </p>
                <p className="text-yellow-700">
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Log in
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 hover:underline"
                  >
                    create an account
                  </Link>{" "}
                  to see all available options.
                </p>
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-6">
                {searchResults.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative h-48 md:h-auto">
                        <Image
                          src={listing.imageUrl}
                          alt={listing.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                        {listing.isPremium && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            PREMIUM
                          </div>
                        )}
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold">{listing.title}</h3>
                          <p className="text-2xl font-bold text-blue-600">
                            ${listing.price}
                          </p>
                        </div>
                        <p className="text-gray-600 my-3">
                          {listing.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {listing.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <button className="btn btn-primary">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  No results found matching your criteria.
                </p>
                <button onClick={goToPreviousStep} className="btn btn-primary">
                  Modify Your Search
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Check for search ID in URL params (for loading saved searches)
  useEffect(() => {
    const searchId = searchParams.get("id");
    if (searchId) {
      setSavedSearchId(searchId);
      loadSavedSearch(searchId);
    }

    // Check for destination in URL params (from homepage)
    const destinationParam = searchParams.get("destination");
    if (destinationParam) {
      setFormData((prev) => ({ ...prev, destination: destinationParam }));
      // Move to the dates step if destination is provided
      setCurrentStep("dates");
    }
  }, [loadSavedSearch, searchParams]);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      {renderCurrentStep()}
    </div>
  );
}
