import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import CustomSelect from "../components/CustomSelect";
import axios from "axios";
import { categories } from "../assets/resources/data";
import Footer from "../components/Footer";
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineLocationMarker,
  HiOutlineCurrencyRupee,
  HiOutlineHome,
  HiOutlineSortDescending,
  HiOutlineRefresh
} from "react-icons/hi";

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

// 1. FIXED INPUT COMPONENT (Removed default black outline)
const FormattedNumberInput = ({
  value,
  onChange,
  onBlur,
  placeholder,
  label,
  icon = null
}) => {
  const [displayValue, setDisplayValue] = useState(formatNumber(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setDisplayValue(formatNumber(value));
  }, [value]);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    setIsFocused(false);
    onBlur && onBlur();
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const cleanedValue = inputValue.replace(/[^\d,]/g, '');
    const parsedValue = parseNumber(cleanedValue);
    setDisplayValue(formatNumber(parsedValue) || cleanedValue);
    onChange(parsedValue);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div className={`
          flex items-center w-full bg-white border-2 rounded-xl transition-all duration-200
          ${isFocused
            ? 'border-sky-500 ring-4 ring-sky-500/10 shadow-lg'
            : 'border-slate-200 hover:border-slate-300'
          }
        `}>
          {icon && (
            <span className={`pl-4 flex-shrink-0 ${isFocused ? 'text-sky-500' : 'text-slate-400'}`}>
              {icon}
            </span>
          )}
          <input
            type="text"
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={`
              w-full bg-transparent border-none outline-none focus:ring-0 text-slate-900 placeholder:text-slate-400
              py-3.5 ${icon ? 'pl-3 pr-4' : 'px-4'} rounded-xl
            `}
          />
        </div>
      </div>
    </div>
  );
};

// 2. FIXED STANDARD INPUT (Removed default black outline)
const StandardInput = ({ value, onChange, placeholder, label, icon, onBlur }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <div className={`
        flex items-center w-full bg-white border-2 rounded-xl transition-all duration-200
        ${isFocused
          ? 'border-sky-500 ring-4 ring-sky-500/10 shadow-lg'
          : 'border-slate-200 hover:border-slate-300'
        }
      `}>
        {icon && (
          <span className={`pl-4 flex-shrink-0 ${isFocused ? 'text-sky-500' : 'text-slate-400'}`}>
            {icon}
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur && onBlur();
          }}
          placeholder={placeholder}
          className={`
            w-full bg-transparent border-none outline-none focus:ring-0 text-slate-900 placeholder:text-slate-400
            py-3.5 ${icon ? 'pl-3 pr-4' : 'px-4'} rounded-xl
          `}
        />
      </div>
    </div>
  );
};

const Properties = () => {
  const [searchParams] = useSearchParams();
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
    { value: "", label: "Any Bedrooms" },
    { value: "1", label: "1+ Bedrooms" },
    { value: "2", label: "2+ Bedrooms" },
    { value: "3", label: "3+ Bedrooms" },
    { value: "4", label: "4+ Bedrooms" },
    { value: "5", label: "5+ Bedrooms" }
  ];

  const sortOptions = [
    { value: "latest", label: "Newest First" },
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
  const [savedPropertyIds, setSavedPropertyIds] = useState([]);

  const fetchProperties = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20"
      });

      if (selectedType && selectedType !== "all") params.append("type", selectedType);
      if (priceRange.min) params.append("minprice", priceRange.min);
      if (priceRange.max) params.append("maxprice", priceRange.max);
      if (bedrooms) params.append("bedrooms", bedrooms);
      if (city.trim()) params.append("city", city.trim());
      if (category) params.append("category", category);
      if (sortBy) params.append("sort", sortBy);

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

  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage, fetchProperties]);

  // Add this useEffect to load the user's favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Replace this URL with your actual endpoint to get saved listing IDs
        const res = await axios.get('/api/user/saved-listings');
        if (res.data.success) {
          // Assuming the API returns an array of listing IDs strings
          // e.g., res.data.savedListings = ["65a...", "65b..."]
          setSavedPropertyIds(res.data.savedListings);
        }
      } catch (err) {
        console.log("Could not fetch favorites", err);
      }
    };

    fetchFavorites();
  }, []); // Empty dependency array = runs once on mount

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties(1);
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
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* HEADER BANNER */}
      <div className="relative bg-gradient-to-r from-sky-600 to-cyan-600 text-white pt-24 pb-32 px-4">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">
            Find Your <span className="text-sky-200">Perfect Space</span>
          </h1>
          <p className="text-xl text-sky-100 max-w-2xl mx-auto leading-relaxed">
            Search through thousands of properties for sale and rent across the most desired locations.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">

        {/* SEARCH & FILTER CONSOLE */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8 mb-12">

          {/* Main Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative group">
                <StandardInput
                  placeholder="Search by location, property name, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<HiOutlineSearch className="w-5 h-5" />}
                  onBlur={() => fetchProperties(1)}
                />
              </div>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Search
              </button>
            </div>
          </form>

          <div className="h-px bg-slate-100 mb-8" />

          {/* Filters Grid */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-lg">
                <HiOutlineFilter className="w-5 h-5 text-sky-500" />
                Filter Properties
              </div>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-sky-600 transition-colors"
              >
                <HiOutlineRefresh className="w-4 h-4" />
                Reset All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Type */}
              <CustomSelect
                label="Property Type"
                value={selectedType}
                onChange={setSelectedType}
                options={propertyTypeOptions}
                icon={<HiOutlineHome className="w-5 h-5" />}
              />

              {/* Category */}
              <CustomSelect
                label="Category"
                value={category}
                onChange={setCategory}
                options={categoryOptions}
                placeholder="All Categories"
              />

              {/* City */}
              <StandardInput
                label="City / Location"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={() => fetchProperties(1)}
                placeholder="e.g. Mumbai"
                icon={<HiOutlineLocationMarker className="w-5 h-5" />}
              />

              {/* Bedrooms */}
              <CustomSelect
                label="Bedrooms"
                value={bedrooms}
                onChange={setBedrooms}
                options={bedroomOptions}
              />

              {/* Min Price */}
              <FormattedNumberInput
                label="Min Price"
                value={priceRange.min}
                onChange={(value) => setPriceRange(prev => ({ ...prev, min: value }))}
                onBlur={() => fetchProperties(1)}
                placeholder="Min Budget"
                icon={<HiOutlineCurrencyRupee className="w-5 h-5" />}
              />

              {/* Max Price */}
              <FormattedNumberInput
                label="Max Price"
                value={priceRange.max}
                onChange={(value) => setPriceRange(prev => ({ ...prev, max: value }))}
                onBlur={() => fetchProperties(1)}
                placeholder="Max Budget"
                icon={<HiOutlineCurrencyRupee className="w-5 h-5" />}
              />

              {/* Sort By */}
              <div className="xl:col-span-2">
                <CustomSelect
                  label="Sort Results"
                  value={sortBy}
                  onChange={setSortBy}
                  options={sortOptions}
                  icon={<HiOutlineSortDescending className="w-5 h-5" />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS SECTION */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {loading ? "Searching..." : `${totalProperties} Properties Found`}
            </h2>
            <p className="text-slate-500 mt-1">
              Showing results based on your preferences
            </p>
          </div>

          {/* Active Filters Tags */}
          <div className="flex gap-2 flex-wrap">
            {selectedType !== "all" && (
              <span className="px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-bold uppercase tracking-wide border border-sky-100">
                {selectedType === "buy" ? "For Sale" : "For Rent"}
              </span>
            )}
            {category && (
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-wide border border-slate-200">
                {category}
              </span>
            )}
          </div>
        </div>

        {/* Grid Content */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl text-center mb-12">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-16 h-16 border-4 border-slate-100 border-t-sky-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">Finding the best properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-[2rem] p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineSearch className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find any properties matching your current filters. Try adjusting your search criteria or removing some filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 text-sky-600 font-semibold hover:text-sky-700 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {properties.map((property) => (
                <div key={property._id} className="transform hover:-translate-y-1 transition-transform duration-300">
                  <PropertyCard
                    property={property}
                    // Check if this ID exists in our saved list
                    saved={savedPropertyIds.includes(property._id)}
                  />
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 inline-flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  <div className="hidden sm:flex items-center gap-1 px-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let startPage = Math.max(1, currentPage - 2);
                      if (startPage + 4 > totalPages) startPage = Math.max(1, totalPages - 4);
                      const pageNum = startPage + i;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === pageNum
                            ? "bg-slate-900 text-white shadow-md scale-105"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Properties;