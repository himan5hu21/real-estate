import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "../assets/resources/data";
import PropertyCard from "./PropertyCard";
import axios from "axios";
import { FaRedo, FaSearch } from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi";
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

  // Keep original logic intact
  const fetchProperties = useCallback(async (page = 1, category = selectedCategory, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6"
      });

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

  useEffect(() => {
    fetchProperties(1, selectedCategory, true);
    setCurrentPage(1);
  }, [selectedCategory, fetchProperties]);

  const handleCategoryClick = (categoryLabel) => {
    setSelectedCategory(categoryLabel);
  };

  const handleShowMore = () => {
    if (hasMore && !loading) {
      const categoryParam = selectedCategory === "All" ? "" : `?category=${encodeURIComponent(selectedCategory)}`;
      navigate(`/properties${categoryParam}`);
    }
  };

  const handleRetry = () => {
    fetchProperties(1, selectedCategory, true);
  };

  return (
    <section className="min-h-screen bg-gray-50/50 py-20 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sky-600 font-medium tracking-wide uppercase text-sm mb-3">
            Real Estate Collection
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-display">
            Discover Your Perfect Space
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Browse our curated selection of properties. From cozy apartments to 
            luxury villas, find the place that fits your life.
          </p>
        </div>

        {/* 2. CATEGORY TABS (Redesigned) */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const isActive = selectedCategory === category.label;
              return (
                <button
                  key={category.label}
                  onClick={() => handleCategoryClick(category.label)}
                  className={`
                    group flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 border
                    ${isActive 
                      ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 transform scale-105" 
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }
                  `}
                >
                  <span className={`text-lg ${isActive ? "text-sky-400" : "text-gray-400 group-hover:text-gray-600"}`}>
                    {category.icon}
                  </span>
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. CONTENT AREA */}
        <div className="min-h-[400px]">
          {error ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <FaRedo className="text-red-500 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {properties.length === 0 && !loading ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaSearch className="text-gray-400 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-500 max-w-sm">
                    We couldn't find any properties in the <strong>{selectedCategory}</strong> category. 
                    Try selecting "All" to see everything we have.
                  </p>
                </div>
              ) : (
                /* Grid Layout */
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property, index) => (
                      <div 
                        key={property._id}
                        className="animate-fadeInUp"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <PropertyCard property={property} />
                      </div>
                    ))}
                  </div>

                  {/* Loading Indicator */}
                  {loading && (
                    <div className="flex justify-center py-12">
                      <div className="flex items-center gap-3 text-sky-600 font-medium bg-sky-50 px-6 py-3 rounded-full">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Loading properties...</span>
                      </div>
                    </div>
                  )}

                  {/* View More Button */}
                  {hasMore && !loading && properties.length > 0 && (
                    <div className="flex justify-center mt-16">
                      <button
                        onClick={handleShowMore}
                        className="group flex items-center gap-2 px-8 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-full hover:border-sky-600 hover:text-sky-600 transition-all shadow-sm hover:shadow-md"
                      >
                        Explore More {selectedCategory === "All" ? "" : selectedCategory}
                        <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {/* End of List */}
                  {!hasMore && properties.length > 0 && (
                    <div className="flex items-center justify-center gap-4 mt-16 opacity-50">
                      <span className="h-px w-20 bg-gray-300"></span>
                      <span className="text-sm text-gray-500 font-medium">End of list</span>
                      <span className="h-px w-20 bg-gray-300"></span>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}

export default Listings;