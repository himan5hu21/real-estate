import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../assets/resources/data";
import PropertyCard from "./PropertyCard";
import axios from "axios";
import { FaRedo } from "react-icons/fa";
import "../assets/css/pages.css";

function Listings() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProperties = useCallback(async (page = 1, category = selectedCategory, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6" // Show 6 properties initially
      });

      // Add category filter if not "All"
      if (category && category !== "All") {
        params.append("category", category);
      }

      const endpoint = `/api/listing/list?${params}`;
      const res = await axios.get(endpoint);

      if (res.data.success) {
        const newProperties = res.data.properties || [];
        setProperties(prev => reset ? newProperties : [...prev, ...newProperties]);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(res.data.currentPage || 1);
        setHasMore(page < res.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError(error.response?.data?.message || "Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  // Fetch properties when category changes
  useEffect(() => {
    fetchProperties(1, selectedCategory, true);
    setCurrentPage(1);
  }, [selectedCategory, fetchProperties]);

  const handleCategoryClick = (categoryLabel) => {
    setSelectedCategory(categoryLabel);
  };

  const handleShowMore = () => {
    if (hasMore && !loading) {
      // Navigate to Properties page with category filter
      const categoryParam = selectedCategory === "All" ? "" : `?category=${encodeURIComponent(selectedCategory)}`;
      navigate(`/properties${categoryParam}`);
    }
  };

  const handleRetry = () => {
    fetchProperties(1, selectedCategory, true);
  };

  return (
    <section className="mx-10 py-12">
      {/* Title */}
      <div className="text-center pb-16">
        <h6 className="capitalize">From concept to reality</h6>
        <h2 className="text-3xl font-bold">Discover our newest listings</h2>
      </div>

      {/* Categories container */}
      <div className="hide-scrollbar flex gap-x-1 xl:justify-center bg-white ring-1 ring-slate-400/5 shadow-md rounded-full px-2 py-3 mb-12">
        {categories.map((category) => (
          <div
            key={category.label}
            className={`flex items-center flex-col gap-2 p-2 rounded-xl cursor-pointer min-w-24 xl:min-w-32 transition-all duration-200 ${
              selectedCategory === category.label
                ? "bg-sky-100 text-sky-700"
                : "hover:bg-gray-50"
            }`}
            style={{ flexShrink: 0 }}
            onClick={() => handleCategoryClick(category.label)}
          >
            <div
              className={`rounded-full h-10 w-10 p-2 flex items-center justify-center text-lg ${
                selectedCategory === category.label
                  ? "bg-sky-600 text-white"
                  : "text-sky-600"
              }`}
              style={{
                backgroundColor: selectedCategory === category.label ? "#0284c7" : category.color
              }}
            >
              {category.icon}
            </div>
            <p className={`text-base ${selectedCategory === category.label ? "font-semibold" : ""}`}>
              {category.label}
            </p>
          </div>
        ))}
      </div>

      {/* Properties Grid */}
      {error ? (
        <div className="text-center py-12">
          <div className="mb-4 text-red-500 text-5xl">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 mx-auto text-white transition rounded-lg bg-sky-700 hover:bg-sky-600"
          >
            <FaRedo /> Try Again
          </button>
        </div>
      ) : (
        <>
          {properties.length === 0 && !loading ? (
            <div className="text-center py-12">
              <div className="mb-4 text-gray-400 text-5xl">🏠</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
              <p className="text-gray-600">
                No properties available in the "{selectedCategory}" category at the moment.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {/* Loading indicator for show more */}
              {loading && properties.length > 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-sky-600">
                    <div className="w-4 h-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading more properties...</span>
                  </div>
                </div>
              )}

              {/* Show More Button */}
              {hasMore && !loading && properties.length > 0 && (
                <div className="text-center">
                  <button
                    onClick={handleShowMore}
                    className="px-8 py-3 text-white transition rounded-lg bg-sky-700 hover:bg-sky-600 font-medium"
                  >
                    View All {selectedCategory} Properties
                  </button>
                </div>
              )}

              {/* All properties loaded message */}
              {!hasMore && properties.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    You've seen all properties in the "{selectedCategory}" category.
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}

export default Listings;
