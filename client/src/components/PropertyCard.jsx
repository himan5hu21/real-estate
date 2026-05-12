import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaHeart, FaBed, FaBath, FaMapMarkerAlt, FaExpandArrowsAlt } from "react-icons/fa";
import CldImage from "./CldImage";

const PropertyCard = ({ property, showHeartIcon = true }) => {
  const { _id, imageUrls, name, bedrooms, bathrooms, address, price, type, area } = property;
  const { currentUser, token } = useSelector((state) => state.user);
  const [isFavorite, setIsFavorite] = useState(false);

  const imageUrl = imageUrls[0];

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (currentUser && token) {
        try {
          const favoritesRes = await axios.get('/api/listing/favorites', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const isInFavorites = favoritesRes.data.favorites.some(
            (fav) => fav._id === _id || fav.toString() === _id
          );
          setIsFavorite(isInFavorites);
        } catch (favError) {
          console.error('Error checking favorites:', favError);
        }
      }
    };
    checkFavoriteStatus();
  }, [_id, currentUser, token]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser || !token) {
      alert("Please log in to add properties to favorites");
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`/api/listing/favorites/${_id}`, { headers: { Authorization: `Bearer ${token}` } });
        setIsFavorite(false);
      } else {
        await axios.post(`/api/listing/favorites/${_id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(error.response?.data?.message || 'Failed to update favorites.');
    }
  };

  return (
    <Link
      to={`/property/${_id}`}
      className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <CldImage
          src={imageUrl || "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1770&q=80"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide backdrop-blur-md shadow-sm ${
            type === 'rent' 
              ? 'bg-emerald-500/90 text-white' 
              : 'bg-sky-500/90 text-white'
          }`}>
            {type === 'rent' ? 'Rent' : 'Sale'}
          </span>
          {area && (
             <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide bg-black/50 backdrop-blur-md text-white shadow-sm">
               {area}
             </span>
          )}
        </div>

        {/* Favorite Button */}
        {showHeartIcon && (
          <button
            onClick={toggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-sm transition-transform active:scale-95 ${
              isFavorite
                ? "bg-white text-rose-500"
                : "bg-black/30 text-white hover:bg-white hover:text-rose-500"
            }`}
          >
            <FaHeart className="w-4 h-4" />
          </button>
        )}

        {/* Price Tag (Overlaid at bottom left for immersive look) */}
        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-baseline gap-1 drop-shadow-md">
            <span className="text-xl font-bold">₹{price?.toLocaleString('en-IN')}</span>
            {type === "rent" && <span className="text-sm font-medium opacity-90">/mo</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Location */}
        <div>
          <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-sky-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center text-slate-500 text-sm mt-1">
            <FaMapMarkerAlt className="w-3.5 h-3.5 mr-1.5 text-sky-500 flex-shrink-0" />
            <span className="truncate">{address.city}, {address.state}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Features Grid */}
        <div className="flex items-center justify-between text-slate-600 text-sm">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
            <FaBed className="text-sky-500" />
            <span className="font-semibold text-slate-900">{bedrooms}</span>
            <span className="text-xs">Beds</span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
            <FaBath className="text-sky-500" />
            <span className="font-semibold text-slate-900">{bathrooms}</span>
            <span className="text-xs">Baths</span>
          </div>

          {area && (
             <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg truncate max-w-[80px]">
               <FaExpandArrowsAlt className="text-sky-500" />
               <span className="text-xs truncate">{area}</span>
             </div>
          )}
        </div>
      </div>
    </Link>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
  showHeartIcon: PropTypes.bool,
};

export default PropertyCard;