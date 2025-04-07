import React, { useState, useEffect } from "react";
import { getMockCategories } from "@/data/products";

export interface FilterState {
  category: string;
  sortBy: "id" | "price" | "rating";
  sortOrder: "asc" | "desc";
  minPrice: string; // Keep as string for input control
  maxPrice: string;
}

interface FiltersProps {
  initialFilters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}

const Filters: React.FC<FiltersProps> = ({
  initialFilters,
  onFilterChange,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [localFilters, setLocalFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    setCategories(getMockCategories()); // Load categories on mount
  }, []);

  useEffect(() => {
    setLocalFilters(initialFilters); // Sync local state if external initialFilters change
  }, [initialFilters]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters only when button is clicked or on blur for price range for performance
  const applyFilters = () => {
    // Create a payload with only changed values or all values depending on desired behavior
    const changes: Partial<FilterState> = {};
    if (localFilters.category !== initialFilters.category)
      changes.category = localFilters.category;
    if (localFilters.sortBy !== initialFilters.sortBy)
      changes.sortBy = localFilters.sortBy;
    if (localFilters.sortOrder !== initialFilters.sortOrder)
      changes.sortOrder = localFilters.sortOrder;
    if (localFilters.minPrice !== initialFilters.minPrice)
      changes.minPrice = localFilters.minPrice;
    if (localFilters.maxPrice !== initialFilters.maxPrice)
      changes.maxPrice = localFilters.maxPrice;

    if (Object.keys(changes).length > 0) {
      onFilterChange(localFilters); // Send the whole local state
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-end">
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={localFilters.category}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="sortBy"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Sort By
        </label>
        <select
          id="sortBy"
          name="sortBy"
          value={localFilters.sortBy}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="id">Default</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="sortOrder"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Order
        </label>
        <select
          id="sortOrder"
          name="sortOrder"
          value={localFilters.sortOrder}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="minPrice"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Min Price
        </label>
        <input
          type="number"
          id="minPrice"
          name="minPrice"
          value={localFilters.minPrice}
          onChange={handleChange}
          onBlur={applyFilters} // Apply on blur
          placeholder="0"
          min="0"
          className="p-2 border rounded w-24"
        />
      </div>
      <div>
        <label
          htmlFor="maxPrice"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Max Price
        </label>
        <input
          type="number"
          id="maxPrice"
          name="maxPrice"
          value={localFilters.maxPrice}
          onChange={handleChange}
          onBlur={applyFilters} // Apply on blur
          placeholder="Any"
          min="0"
          className="p-2 border rounded w-24"
        />
      </div>

      <button
        onClick={applyFilters}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;
