import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaHeart } from "react-icons/fa";

// import { Link } from "react-router-dom";

const PropertyCard = ({ property, showHeartIcon = true }) => {
  const { _id, imageUrls, name, bedrooms, bathrooms, address, price, type, area } =
    property;
  const { currentUser, token } = useSelector((state) => state.user);
  const [isFavorite, setIsFavorite] = useState(false);

  const imageUrl = imageUrls[0];

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (currentUser && token) {
        try {
          const favoritesRes = await axios.get('/api/listing/favorites', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    if (!currentUser || !token) {
      alert("Please log in to add properties to favorites");
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`/api/listing/favorites/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFavorite(false);
      } else {
        // Add to favorites
        await axios.post(`/api/listing/favorites/${_id}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update favorites. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <Link
      to={`/property/${_id}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-sky-200 overflow-hidden focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2"
      aria-label={`View details for ${name}, ${bedrooms} bedroom ${type === 'rent' ? 'rental' : 'property'} in ${address.city} for ${price?.toLocaleString('en-IN')} rupees ${type === 'rent' ? 'per month' : ''}`}
    >
      <div className="relative overflow-hidden">
        <img
          alt={`${name} - ${bedrooms} bedroom ${type === 'rent' ? 'rental' : 'property'} in ${address.city}`}
          src={`${
            imageUrl ||
            "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          }`}
          loading="lazy"
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {imageUrls.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span aria-label={`${imageUrls.length} photos available`}>{imageUrls.length}</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            type === 'rent'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-sky-100 text-sky-800'
          }`}>
            {type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>

        {/* Favorite/Like Button */}
        {showHeartIcon && (
          <button
            onClick={toggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition ${
              isFavorite
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <FaHeart className={isFavorite ? "text-white" : "text-gray-600"} />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xl font-bold text-gray-900" aria-label={`Price: ${price?.toLocaleString('en-IN')} rupees`}>
              ₹{price?.toLocaleString('en-IN')}
            </span>
            {type === "rent" && (
              <span className="text-sm text-gray-500" aria-label="per month">/month</span>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors duration-200">
          {name}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mb-3" aria-label={`Location: ${address.city}, ${address.state}`}>
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="truncate">{address.city}, {address.state}</span>
        </div>

        <div className="flex items-center justify-between text-sm" role="list" aria-label="Property features">
          <div className="flex items-center text-gray-600" role="listitem">
            <svg className="w-4 h-4 mr-1 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span className="font-medium" aria-label={`${bedrooms} bedroom${bedrooms !== 1 ? 's' : ''}`}>{bedrooms}</span>
            <span className="ml-1" aria-hidden="true">bed{bedrooms !== 1 ? 's' : ''}</span>
          </div>

          <div className="flex items-center text-gray-600" role="listitem">
            <svg className="w-4 h-4 mr-1 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="font-medium" aria-label={`${bathrooms} bathroom${bathrooms !== 1 ? 's' : ''}`}>{bathrooms}</span>
            <span className="ml-1" aria-hidden="true">bath{bathrooms !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {area && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500" role="listitem" aria-label={`Area: ${area}`}>
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{area}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageUrls: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    address: PropTypes.object.isRequired,
    price: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    area: PropTypes.string,
  }).isRequired,
  showHeartIcon: PropTypes.bool,
};

export default PropertyCard;
