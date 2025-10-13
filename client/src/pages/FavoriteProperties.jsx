import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaHeart, FaExclamationTriangle, FaRedo, FaSearch } from "react-icons/fa";
import PropertyCard from "../components/PropertyCard";
import axios from "axios";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const FavoriteProperties = () => {
  const { currentUser, token } = useSelector((state) => state.user);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    if (!currentUser || !token) {
      setError("Please log in to view your favorite properties");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axios.get('/api/listing/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setFavorites(res.data.favorites || []);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError(error.response?.data?.message || "Failed to fetch favorite properties");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [currentUser, token]);

  const handleRetry = () => {
    fetchFavorites();
  };

  const handleRemoveFromFavorites = async (propertyId) => {
    try {
      await axios.delete(`/api/listing/favorites/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the property from local state
      setFavorites(prev => prev.filter(property => property._id !== propertyId));
    } catch (error) {
      console.error("Error removing from favorites:", error);
      alert(error.response?.data?.message || "Failed to remove from favorites");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-12 bg-gray-300 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-96 animate-pulse"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 shadow-lg rounded-xl animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-t-xl"></div>
                <div className="p-6 space-y-4">
                  <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
                  <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                  <div className="flex gap-2">
                    <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
                    <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Favorite Properties</h1>
            <p className="text-gray-600">Properties you've liked</p>
          </div>

          {/* Error State */}
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <FaExclamationTriangle className="mx-auto mb-4 text-5xl text-red-500" />
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Oops!</h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 px-6 py-3 mx-auto text-white transition rounded-lg bg-sky-700 hover:bg-sky-600 w-full"
            >
              <FaRedo /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-800 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Favorite Properties
          </h1>
          <p className="text-xl text-sky-100 max-w-2xl mx-auto mb-8">
            Your saved properties - easily access and manage the homes you've loved
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="bg-white text-sky-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <FaSearch /> Browse More Properties
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="mb-8">
              <FaHeart className="mx-auto mb-6 text-8xl text-gray-300" />
              <h2 className="mb-4 text-3xl font-semibold text-gray-800">No Favorite Properties</h2>
              <p className="mb-8 text-lg text-gray-600 max-w-md mx-auto">
                You haven't liked any properties yet. Start browsing and click the heart icon to save your favorites for easy access later!
              </p>
            </div>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-8 py-4 text-white transition rounded-lg bg-sky-700 hover:bg-sky-600 font-semibold text-lg"
            >
              <FaSearch /> Browse Properties
            </Link>
          </div>
        ) : (
          <>
            {/* Properties Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Your Favorites ({favorites.length} {favorites.length === 1 ? 'property' : 'properties'})
              </h2>
              <p className="text-gray-600">
                Manage your saved properties - remove them anytime or browse for more options.
              </p>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favorites.map((property) => (
                <div key={property._id} className="relative group">
                  <PropertyCard
                    property={property}
                    showHeartIcon={false}
                  />
                  <button
                    onClick={() => handleRemoveFromFavorites(property._id)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from favorites"
                    aria-label="Remove from favorites"
                  >
                    <FaHeart className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Additional Actions */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6">
                Want to see more options? Browse our full collection of properties.
              </p>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-8 py-3 text-white transition rounded-lg bg-sky-700 hover:bg-sky-600 font-semibold"
              >
                <FaSearch /> Browse All Properties
              </Link>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FavoriteProperties;
