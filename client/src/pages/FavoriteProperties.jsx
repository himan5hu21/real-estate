import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { 
  HiOutlineHeart, 
  HiOutlineSearch, 
  HiOutlineTrash, 
  HiOutlineCollection,
  HiOutlineExclamation 
} from "react-icons/hi";
import { FaHeart } from "react-icons/fa"; // Keep filled heart for visual
import PropertyCard from "../components/PropertyCard";
import axios from "axios";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

const FavoriteProperties = () => {
  const { currentUser, token } = useSelector((state) => state.user);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    if(!confirm("Remove this property from your favorites?")) return;

    try {
      await axios.delete(`/api/listing/favorites/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavorites(prev => prev.filter(property => property._id !== propertyId));
    } catch (error) {
      console.error("Error removing from favorites:", error);
      alert(error.response?.data?.message || "Failed to remove from favorites");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineExclamation className="text-rose-500 text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Error</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. DASHBOARD HEADER (Matched MyProperty.jsx) */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-8 px-4 shadow-sm relative z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            {/* Title Section */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-500 mb-2 uppercase tracking-wide">
                <HiOutlineHeart className="w-4 h-4" />
                <span>Collection</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Favorite Properties
              </h1>
              <p className="text-slate-500 mt-2 max-w-lg text-lg">
                Your personal collection of saved homes. Keep track of the properties you love.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => navigate("/properties")}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
            >
              <HiOutlineSearch className="w-5 h-5" /> 
              Browse More
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        
        {favorites.length === 0 ? (
          /* Empty State (Matched MyProperty.jsx) */
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-16 text-center max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineHeart className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              No Favorites Yet
            </h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              You haven't saved any properties yet. Start browsing and click the heart icon to save your favorites here.
            </p>
            <button
              onClick={() => navigate("/properties")}
              className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <HiOutlineSearch className="w-5 h-5" /> 
              Explore Properties
            </button>
          </div>
        ) : (
          /* Property Grid */
          <>
            <div className="flex items-center gap-3 mb-8 px-1">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                <HiOutlineCollection className="w-5 h-5 text-rose-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Saved Items <span className="text-slate-400 font-medium ml-1">({favorites.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {favorites.map((property) => (
                <div key={property._id} className="relative group">
                  {/* Property Card */}
                  <PropertyCard
                    property={property}
                    showHeartIcon={false} // We provide custom remove button below
                  />
                  
                  {/* Overlay Actions (Consistent with MyProperty) */}
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFromFavorites(property._id);
                      }}
                      className="bg-white text-rose-500 p-2.5 rounded-full shadow-lg hover:bg-rose-500 hover:text-white transition-all hover:scale-110 flex items-center justify-center"
                      title="Remove from favorites"
                    >
                      <FaHeart className="w-4 h-4" /> {/* Filled heart to indicate removal */}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Link */}
            <div className="mt-16 text-center border-t border-slate-200 pt-10">
              <p className="text-slate-500 mb-6 text-lg">Looking for something else?</p>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-sky-500 hover:text-sky-600 transition-all hover:shadow-md"
              >
                <HiOutlineSearch /> Browse All Listings
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