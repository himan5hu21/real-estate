import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import CustomSelect from "../components/CustomSelect";
import axios from "axios";
import { categories } from "../assets/resources/data";
import Footer from "../components/Footer";

// Utility functions for number formatting
const formatNumber = (value) => {
  if (!value || value === "") return "";
  const num = parseInt(value.toString().replace(/,/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString('en-IN');
};

const parseNumber = (value) => {
  if (!value || value === "") return "";
  return value.toString().replace(/,/g, "");
};

// Enhanced number input component with better editing support
const FormattedNumberInput = ({
  value,
  onChange,
  onBlur,
  placeholder,
  label,
  className = ""
}) => {
  const [displayValue, setDisplayValue] = useState(formatNumber(value));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Always show formatted value, but track if user is actively editing
    setDisplayValue(formatNumber(value));
  }, [value]);

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onBlur && onBlur();
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    // Allow only numbers and commas for formatted input
    const cleanedValue = inputValue.replace(/[^\d,]/g, '');

    // Parse the cleaned value to get the actual number
    const parsedValue = parseNumber(cleanedValue);

    // Update display to show what user types (with formatting)
    setDisplayValue(formatNumber(parsedValue) || cleanedValue);

    // Update parent state with parsed number
    onChange(parsedValue);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${className}`}
      />
    </div>
  );
};

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [isRenting, setIsRenting] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("search") || "");
  const [selectedType, setSelectedType] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [bedrooms, setBedrooms] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState(() => searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("latest");

  // Select options
  const propertyTypeOptions = [
    { value: "all", label: "All Properties" },
    { value: "buy", label: "For Sale" },
    { value: "rent", label: "For Rent" }
  ];

  const bedroomOptions = [
    { value: "", label: "Any" },
    { value: "1", label: "1+" },
    { value: "2", label: "2+" },
    { value: "3", label: "3+" },
    { value: "4", label: "4+" },
    { value: "5", label: "5+" }
  ];

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "low-to-high", label: "Price: Low to High" },
    { value: "high-to-low", label: "Price: High to Low" }
  ];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.filter(cat => cat.label !== "All").map(cat => ({ value: cat.label, label: cat.label }))
  ];
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);

  const fetchProperties = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20"
      });
      
      // Add filters to params
      if (selectedType && selectedType !== "all") {
        params.append("type", selectedType);
      }
      if (priceRange.min) {
        params.append("minprice", priceRange.min);
      }
      if (priceRange.max) {
        params.append("maxprice", priceRange.max);
      }
      if (bedrooms) {
        params.append("bedrooms", bedrooms);
      }
      if (city.trim()) {
        params.append("city", city.trim());
      }
      if (category) {
        params.append("category", category);
      }
      if (sortBy) {
        params.append("sort", sortBy);
      }
      
      const endpoint = searchTerm.trim() 
        ? `/api/listing/search?keyword=${encodeURIComponent(searchTerm.trim())}&${params}`
        : `/api/listing/list?${params}`;
      
      const res = await axios.get(endpoint);
      
      if (res.data.success) {
        setProperties(res.data.properties || []);
        setTotalProperties(res.data.totalProperties || 0);
        setTotalPages(res.data.totalPages || 1);
        setCurrentPage(res.data.currentPage || 1);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError(error.response?.data?.message || "Failed to fetch properties");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [selectedType, priceRange, bedrooms, city, category, sortBy, searchTerm]);

  useEffect(() => {
    fetchProperties(1);
  }, [fetchProperties]);

  // Separate useEffect to trigger fetch when filter states change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) { // Only auto-fetch on page 1 to avoid conflicts with pagination
        fetchProperties(1);
      }
    }, 100); // Small delay to ensure state has updated

    return () => clearTimeout(timeoutId);
  }, [selectedType, priceRange, bedrooms, city, category, sortBy, searchTerm, fetchProperties, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(1);
  };

  const handleFilterChange = useCallback(() => {
    fetchProperties(1);
  }, [fetchProperties]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchProperties(newPage);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setPriceRange({ min: "", max: "" });
    setBedrooms("");
    setCity("");
    setCategory("");
    setSortBy("latest");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-sky-600 to-sky-800 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Dream Property
          </h1>
          <p className="text-xl text-sky-100 max-w-2xl mx-auto">
            Discover amazing properties for sale and rent in your desired location
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Properties
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter location, property name, or keywords..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </form>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
            <button
              onClick={resetFilters}
              className="text-sky-600 hover:text-sky-800 font-medium transition-colors duration-200"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <CustomSelect
                value={selectedType}
                onChange={(value) => {
                  setSelectedType(value);
                }}
                options={propertyTypeOptions}
                placeholder="Select property type"
              />
            </div>

            {/* Price Range */}
            <div>
              <FormattedNumberInput
                label="Min Price (₹)"
                value={priceRange.min}
                onChange={(value) => setPriceRange(prev => ({ ...prev, min: value }))}
                onBlur={handleFilterChange}
                placeholder="e.g., 10,00,000"
              />
            </div>

            <div>
              <FormattedNumberInput
                label="Max Price (₹)"
                value={priceRange.max}
                onChange={(value) => setPriceRange(prev => ({ ...prev, max: value }))}
                onBlur={handleFilterChange}
                placeholder="e.g., 50,00,000"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <CustomSelect
                value={bedrooms}
                onChange={(value) => {
                  setBedrooms(value);
                }}
                options={bedroomOptions}
                placeholder="Select bedrooms"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <CustomSelect
                value={category}
                onChange={(value) => {
                  setCategory(value);
                }}
                options={categoryOptions}
                placeholder="Select category"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={handleFilterChange}
                placeholder="Enter city"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <CustomSelect
                value={sortBy}
                onChange={(value) => {
                  setSortBy(value);
                }}
                options={sortOptions}
                placeholder="Select sorting"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {loading ? "Searching..." : `Found ${totalProperties} Properties`}
            </h2>
            <div className="flex gap-2">
              {selectedType !== "all" && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {selectedType === "buy" ? "For Sale" : "For Rent"}
                </span>
              )}
              {category && (
                <span className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                  {category}
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No properties found</div>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 mt-8">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-sky-600 hover:bg-sky-50 border border-gray-200 hover:border-sky-200"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {/* First Page */}
                    {currentPage > 3 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg border border-gray-200 hover:border-sky-200 transition-all duration-200 min-w-[2.5rem]"
                        >
                          1
                        </button>
                        {currentPage > 4 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                      </>
                    )}

                    {/* Page Range */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (pageNum > totalPages || pageNum < 1) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 min-w-[2.5rem] ${
                            currentPage === pageNum
                              ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                              : "text-gray-600 hover:text-sky-600 hover:bg-sky-50 border-gray-200 hover:border-sky-200"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Last Page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg border border-gray-200 hover:border-sky-200 transition-all duration-200 min-w-[2.5rem]"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-sky-600 hover:bg-sky-50 border border-gray-200 hover:border-sky-200"
                    }`}
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Properties;
