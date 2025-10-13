import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  FaBed,
  FaBath,
  FaUsers,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaHeart,
  FaShare,
  FaChevronLeft,
  FaExclamationTriangle,
  FaRedo,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import OwnerContactCard from "../components/OwnerContactCard";
import Footer from "../components/Footer";

const PropertyDetails = () => {
  const { id } = useParams();
  const { currentUser, token } = useSelector((state) => state.user);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOwner, setShowOwner] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const shareButtonRef = useRef(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/listing/list/${id}`);
        setProperty(res.data.listing);

        // Check if property is in favorites if user is logged in
        if (currentUser && token) {
          try {
            const favoritesRes = await axios.get('/api/listing/favorites', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const isInFavorites = favoritesRes.data.favorites.some(
              (fav) => fav._id === id || fav.toString() === id
            );
            setIsFavorite(isInFavorites);
          } catch (favError) {
            console.error('Error checking favorites:', favError);
          }
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, currentUser, token]);

  const handleRetry = () => window.location.reload();

  const toggleFavorite = async () => {
    if (!currentUser || !token) {
      alert("Please log in to add properties to favorites");
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`/api/listing/favorites/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFavorite(false);
      } else {
        // Add to favorites
        await axios.post(`/api/listing/favorites/${id}`, {}, {
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

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => setShowImageModal(false);

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === property.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? property.imageUrls.length - 1 : prev - 1
    );
  };

  
  const handleShare = async () => {
    const shareData = {
      title: name,
      text: `Check out this ${type === 'buy' ? 'property for sale' : 'rental property'}: ${name}`,
      url: window.location.href,
    };

    try {
      // Check if Web Share API is supported (mobile devices)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for desktop - copy to clipboard
        await navigator.clipboard.writeText(window.location.href);

        // Show a temporary success message
        const originalText = shareButtonRef.current?.textContent || 'Share';
        if (shareButtonRef.current) {
          shareButtonRef.current.textContent = 'Copied!';
          shareButtonRef.current.classList.add('text-green-600');

          setTimeout(() => {
            if (shareButtonRef.current) {
              shareButtonRef.current.textContent = originalText;
              shareButtonRef.current.classList.remove('text-green-600');
            }
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Fallback: copy to clipboard if sharing fails
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (clipboardErr) {
        console.error('Failed to copy to clipboard:', clipboardErr);
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl px-4 py-8 mx-auto">
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl animate-pulse">
          <div className="w-full h-[400px] bg-gray-300 rounded-t-xl"></div>
          <div className="p-6 space-y-4">
            <div className="w-3/4 h-8 bg-gray-300 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
            <div className="flex gap-2">
              <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
              <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
              <div className="w-24 h-6 bg-gray-300 rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl px-4 py-8 mx-auto text-center">
        <FaExclamationTriangle className="mx-auto mb-4 text-5xl text-red-500" />
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Oops!</h2>
        <p className="mb-6 text-gray-600">{error}</p>
        <button
          onClick={handleRetry}
          className="flex items-center gap-2 px-6 py-3 mx-auto text-white transition rounded-lg bg-sky-700 hover:bg-sky-600"
        >
          <FaRedo /> Try Again
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-6xl px-4 py-8 mx-auto text-center">
        <FaExclamationTriangle className="mx-auto mb-4 text-5xl text-red-500" />
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Property Not Found</h2>
        <p className="mb-6 text-gray-600">
          The property you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/properties"
          className="px-6 py-3 text-white transition rounded-lg bg-sky-700 hover:bg-sky-600"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  const {
    userRef,
    name,
    description,
    price,
    address,
    bedrooms,
    bathrooms,
    guestrooms,
    beds,
    features,
    imageUrls,
    type,
    area,
    category,
  } = property;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="transition hover:text-sky-600">Home</Link>
            <FaChevronLeft className="w-3 h-3 mx-2" />
            <Link to="/properties" className="transition hover:text-sky-600">Properties</Link>
            <FaChevronLeft className="w-3 h-3 mx-2" />
            <span className="font-medium text-gray-800">{name}</span>
          </div>
        </nav>

        {/* Property Card */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl">
          {/* === Image Carousel Section === */}
          <div className="relative">
            <img
              src={imageUrls[selectedImageIndex]}
              alt={name}
              className="w-full h-[400px] md:h-[500px] object-cover cursor-pointer transition"
              onClick={() => openImageModal(selectedImageIndex)}
            />

            {/* Floating Like/Share Buttons */}
            <div className="absolute flex gap-3 top-4 right-4">
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-full shadow-md transition ${isFavorite
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <FaHeart />
              </button>
              <button
                ref={shareButtonRef}
                onClick={handleShare}
                className="p-3 text-gray-700 transition bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <FaShare />
              </button>
            </div>

            {/* Carousel Buttons */}
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute p-3 text-white transition -translate-y-1/2 bg-black rounded-full left-4 top-1/2 bg-opacity-40 hover:bg-opacity-60"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute p-3 text-white transition -translate-y-1/2 bg-black rounded-full right-4 top-1/2 bg-opacity-40 hover:bg-opacity-60"
                >
                  ›
                </button>
                <div className="absolute px-3 py-1 text-sm text-white bg-black bg-opacity-50 rounded-full bottom-4 right-4">
                  {selectedImageIndex + 1} / {imageUrls.length}
                </div>
              </>
            )}
          </div>

          <div className="p-6 lg:p-8">
            {/* Title and Info */}
            <div className="flex flex-col justify-between gap-4 mb-6 lg:flex-row">
              <div>
                <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">{name}</h1>
                <div className="flex items-start gap-2 mb-3 text-gray-600">
                  <FaMapMarkerAlt className="mt-1 text-red-500" />
                  <span>
                    {address?.streetAddress}, {address?.city}, {address?.state},{" "}
                    {address?.country}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${type === "buy" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                    {type === "buy" ? "For Sale" : "For Rent"}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-sky-100 text-sky-700">
                    {category}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">
                    {area}
                  </span>
                </div>
              </div>

              <div className="flex items-center text-3xl font-bold text-sky-700">
                <FaRupeeSign />
                <span>{price.toLocaleString()}</span>
                {type === "rent" && (
                  <span className="ml-2 text-base text-gray-600">/month</span>
                )}
              </div>
            </div>

            {/* Image Gallery */}
            {imageUrls.length > 1 && (
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Gallery</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {imageUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`property-${i}`}
                      className="object-cover w-full h-24 transition rounded-lg shadow-md cursor-pointer sm:h-32 hover:shadow-lg"
                      onClick={() => openImageModal(i)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Main Details */}
              <div className="space-y-8 lg:col-span-2">
                <section>
                  <h2 className="mb-4 text-2xl font-semibold text-gray-800">Description</h2>
                  <p className="leading-relaxed text-gray-700">{description}</p>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-semibold text-gray-800">Features</h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Feature icon={<FaBed />} label="Bedrooms" value={bedrooms} />
                    <Feature icon={<FaBath />} label="Bathrooms" value={bathrooms} />
                    <Feature icon={<FaUsers />} label="Guests" value={guestrooms} />
                    <Feature icon={<FaBed />} label="Beds" value={beds} />
                  </div>
                </section>

                <section>
                  <h2 className="mb-4 text-2xl font-semibold text-gray-800">Amenities</h2>
                  {features?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {features.map((item, i) => (
                        <span key={i} className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="italic text-gray-500">No amenities listed.</p>
                  )}
                </section>
              </div>

              {/* Sidebar */}
              <aside className="sticky space-y-4 lg:col-span-1 top-6">
                <div className="p-6 border border-gray-200 bg-gray-50 rounded-xl">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">Interested in this property?</h3>
                  <button
                    onClick={() => setShowOwner((p) => !p)}
                    className="w-full px-6 py-3 text-white transition rounded-lg bg-sky-700 hover:bg-sky-600"
                  >
                    {showOwner ? "Hide Contact" : "Contact Owner"}
                  </button>
                </div>

                {showOwner && (
                  <div className="bg-white border shadow-md rounded-xl">
                    <OwnerContactCard ownerId={userRef} />
                  </div>
                )}
              </aside>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm">
            <div className="relative max-w-5xl max-h-[90vh] w-full">
              {/* Close Button */}
              {/* Main Image Container */}
              <div className="overflow-hidden bg-white shadow-2xl rounded-2xl">
                <div className="relative flex items-center justify-center min-h-[60vh] max-h-[80vh] bg-gray-50">
                  <img
                    src={imageUrls[selectedImageIndex]}
                    alt={`property-${selectedImageIndex}`}
                    className="object-cover w-full h-full rounded-2xl"
                  />

                  <button
                    onClick={closeImageModal}
                    className="absolute z-50 p-2 text-3xl text-white transition-colors bg-black bg-opacity-50 rounded-full top-5 right-5 hover:text-gray-300"
                  >
                    <IoMdClose />
                  </button>

                  {/* Navigation Buttons */}
                  {imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute p-4 text-gray-800 transition-all duration-200 -translate-y-1/2 bg-white rounded-full shadow-lg left-4 top-1/2 bg-opacity-90 hover:bg-opacity-100 hover:scale-105"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute p-4 text-gray-800 transition-all duration-200 -translate-y-1/2 bg-white rounded-full shadow-lg right-4 top-1/2 bg-opacity-90 hover:bg-opacity-100 hover:scale-105"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                {/* Image Counter & Info */}
                <div className="absolute px-4 py-2 text-sm text-white -translate-x-1/2 bg-black rounded-full bottom-4 left-1/2 bg-opacity-70 backdrop-blur-sm">
                  {selectedImageIndex + 1} / {imageUrls.length}
                </div>
              </div>

              {/* Thumbnail Strip (Optional - for better UX) */}
              {imageUrls.length > 1 && (
                <div className="flex justify-center gap-2 pb-2 mt-4 overflow-x-auto">
                  {imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImageIndex === index
                          ? "border-sky-500 ring-2 ring-sky-300"
                          : "border-gray-300 hover:border-gray-400"
                        }`}
                    >
                      <img
                        src={url}
                        alt={`thumbnail-${index}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

const Feature = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 px-4 py-3 text-gray-700 border rounded-lg shadow-sm bg-slate-50">
    <div className="text-xl text-sky-600">{icon}</div>
    <div>
      <p className="font-medium">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
);

export default PropertyDetails;
