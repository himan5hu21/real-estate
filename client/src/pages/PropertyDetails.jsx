import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
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
  FaChevronRight,
  FaExclamationTriangle,
  FaCheckCircle,
  FaExpand
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

  // --- FETCH LOGIC (Unchanged) ---
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/api/listing/list/${id}`);
        setProperty(res.data.listing);

        if (currentUser && token) {
          try {
            const favoritesRes = await axios.get('/api/listing/favorites', {
              headers: { Authorization: `Bearer ${token}` },
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
        await axios.delete(`/api/listing/favorites/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setIsFavorite(false);
      } else {
        await axios.post(`/api/listing/favorites/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(error.response?.data?.message || 'Failed to update favorites.');
    }
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => setShowImageModal(false);

  const nextImage = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev === property.imageUrls.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? property.imageUrls.length - 1 : prev - 1));
  };

  const handleShare = async () => {
    if (!property) return;
    const shareData = {
      title: property.name,
      text: `Check out this property: ${property.name}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto animate-pulse space-y-8">
           <div className="h-[500px] bg-slate-100 rounded-3xl w-full"></div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-4">
               <div className="h-8 bg-slate-100 rounded w-3/4"></div>
               <div className="h-4 bg-slate-100 rounded w-1/2"></div>
               <div className="h-32 bg-slate-100 rounded w-full mt-6"></div>
             </div>
             <div className="h-64 bg-slate-100 rounded-2xl w-full"></div>
           </div>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <FaExclamationTriangle className="mx-auto mb-4 text-5xl text-rose-500" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{error ? "Oops!" : "Property Not Found"}</h2>
          <p className="text-slate-500 mb-6">{error || "The property you're looking for doesn't exist."}</p>
          <div className="flex justify-center gap-4">
             <Link to="/properties" className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition">Browse All</Link>
             <button onClick={handleRetry} className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition">Try Again</button>
          </div>
        </div>
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
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb - Using Slate tones from Footer */}
        <nav className="flex items-center text-sm text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:text-sky-600 transition">Home</Link>
          <FaChevronLeft className="mx-2 w-3 h-3 text-slate-300" />
          <Link to="/properties" className="hover:text-sky-600 transition">Properties</Link>
          <FaChevronLeft className="mx-2 w-3 h-3 text-slate-300" />
          <span className="text-slate-900 truncate max-w-[200px]">{name}</span>
        </nav>

        {/* === 1. CAROUSEL SECTION (Preserved functionality, updated styling) === */}
        <div className="space-y-4 mb-12">
          {/* Main Carousel Container */}
          <div className="relative w-full h-[400px] md:h-[600px] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 group">
            
            {/* Image */}
            <img 
              src={imageUrls[selectedImageIndex]} 
              alt="Property View" 
              className="w-full h-full object-cover"
              onClick={() => openImageModal(selectedImageIndex)}
            />

            {/* Gradient Overlay (Subtle dark fade at bottom like footer) */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

            {/* Navigation Arrows */}
            {imageUrls.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white text-white hover:text-slate-900 p-4 rounded-full backdrop-blur-md transition-all border border-white/20 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
                >
                  <FaChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white text-white hover:text-slate-900 p-4 rounded-full backdrop-blur-md transition-all border border-white/20 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                >
                  <FaChevronRight size={20} />
                </button>
              </>
            )}

            {/* Top Right Actions */}
            <div className="absolute top-6 right-6 flex gap-3">
               <button onClick={toggleFavorite} className={`p-3.5 rounded-2xl backdrop-blur-md transition shadow-lg border border-white/20 ${isFavorite ? "bg-white text-rose-500" : "bg-slate-900/30 text-white hover:bg-white hover:text-slate-900"}`}>
                 <FaHeart className="w-5 h-5" />
               </button>
               <button onClick={handleShare} className="p-3.5 rounded-2xl bg-slate-900/30 text-white backdrop-blur-md transition shadow-lg border border-white/20 hover:bg-white hover:text-slate-900">
                 <FaShare className="w-5 h-5" />
               </button>
               <button onClick={() => openImageModal(selectedImageIndex)} className="p-3.5 rounded-2xl bg-slate-900/30 text-white backdrop-blur-md transition shadow-lg border border-white/20 hover:bg-white hover:text-slate-900">
                 <FaExpand className="w-5 h-5" />
               </button>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-8 right-8 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-xl border border-white/10">
               {selectedImageIndex + 1} / {imageUrls.length}
            </div>
          </div>

          {/* Thumbnails */}
          {imageUrls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
              {imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative flex-shrink-0 w-24 h-24 md:w-36 md:h-28 rounded-2xl overflow-hidden transition-all duration-300 ${
                    selectedImageIndex === index ? "ring-2 ring-sky-500 ring-offset-2 opacity-100 scale-100" : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
                  }`}
                >
                  <img src={url} alt={`Thumb ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>


        {/* === 2. CONTENT GRID === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Header Info */}
            <div className="border-b border-slate-100 pb-10">
              <div className="flex flex-wrap gap-3 mb-6">
                 {/* Tags matching Footer Gradient style */}
                 <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-white shadow-md ${type === 'buy' ? 'bg-emerald-500' : 'bg-gradient-to-r from-sky-500 to-cyan-500'}`}>
                   {type === 'buy' ? 'For Sale' : 'For Rent'}
                 </span>
                 <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-slate-100 text-slate-600 border border-slate-200">
                   {category}
                 </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{name}</h1>
              <div className="flex items-center text-slate-500 text-lg font-medium">
                <FaMapMarkerAlt className="text-sky-500 mr-2.5" />
                {address?.streetAddress}, {address?.city}, {address?.state}
              </div>
            </div>

            {/* Key Stats - Styled to match Footer's "Brand Column" clean look */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <StatBox icon={<FaUsers />} label="Guests" value={guestrooms} />
               <StatBox icon={<FaBed />} label="Bedrooms" value={bedrooms} />
               <StatBox icon={<FaBed />} label="Beds" value={beds} />
               <StatBox icon={<FaBath />} label="Bathrooms" value={bathrooms} />
            </div>

            {/* Description */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-gradient-to-b from-sky-500 to-cyan-500 rounded-full" />
                About this property
              </h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                {description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-gradient-to-b from-sky-500 to-cyan-500 rounded-full" />
                What this place offers
              </h3>
              {features?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-200 transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sky-500 shadow-sm group-hover:scale-110 transition-transform">
                        <FaCheckCircle />
                      </div>
                      <span className="text-slate-700 font-semibold capitalize">{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No specific amenities listed.</p>
              )}
            </div>
          </div>

          {/* Right: Sticky Price Card */}
          <div className="lg:col-span-1">
             <div className="sticky top-28">
                {/* Card matches Footer's rounded-2xl and uses slate/white contrast */}
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 p-8 border border-slate-100 relative overflow-hidden">
                   
                   {/* Decorative background blob similar to footer */}
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-50 rounded-full blur-3xl" />

                   <div className="relative">
                     <p className="text-slate-500 text-sm font-medium mb-1">Total Price</p>
                     <div className="flex items-baseline gap-1 mb-8">
                        <FaRupeeSign className="text-2xl text-slate-900" />
                        <span className="text-5xl font-bold text-slate-900 tracking-tight">{price.toLocaleString()}</span>
                        {type === 'rent' && <span className="text-slate-400 font-medium text-lg ml-2">/ month</span>}
                     </div>

                     <div className="space-y-4">
                        {/* Primary Button - Matches Footer Newsletter Button Gradient exactly */}
                        <button
                          onClick={() => setShowOwner(!showOwner)}
                          className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                          {showOwner ? 'Close Contact Info' : 'Contact Owner'}
                        </button>
                        
                        {/* Secondary Button */}
                        <button 
                          onClick={toggleFavorite}
                          className={`w-full py-4 rounded-2xl font-bold text-lg border-2 transition-all duration-300 ${isFavorite ? "border-rose-100 bg-rose-50 text-rose-600" : "border-slate-100 text-slate-600 hover:border-slate-300 hover:text-slate-900"}`}
                        >
                          {isFavorite ? 'Saved to Favorites' : 'Save Property'}
                        </button>
                        
                        {showOwner && (
                          <div className="pt-6 animate-fadeIn border-t border-slate-100 mt-6">
                             <OwnerContactCard ownerId={userRef} />
                          </div>
                        )}
                     </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>

      <Footer />

      {/* --- FULLSCREEN IMAGE MODAL --- */}
      {showImageModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button 
            onClick={closeImageModal}
            className="absolute top-6 right-6 text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition z-50"
          >
             <IoMdClose size={32} />
          </button>
          
          <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center">
             <img 
               src={imageUrls[selectedImageIndex]} 
               alt="Gallery Fullscreen" 
               className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
             />

             {imageUrls.length > 1 && (
               <>
                 <button 
                   onClick={prevImage}
                   className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-slate-900/50 hover:bg-slate-900 text-white p-4 rounded-full backdrop-blur-md transition border border-white/10"
                 >
                    <FaChevronLeft size={24} />
                 </button>
                 <button 
                   onClick={nextImage}
                   className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-slate-900/50 hover:bg-slate-900 text-white p-4 rounded-full backdrop-blur-md transition border border-white/10"
                 >
                    <FaChevronRight size={24} />
                 </button>
               </>
             )}
             
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white font-medium bg-slate-800/80 px-6 py-2 rounded-full border border-white/10">
                {selectedImageIndex + 1} / {imageUrls.length}
             </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
           from { opacity: 0; transform: translateY(-10px); }
           to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

// Updated StatBox to match footer iconography style (Slate background + rounded-2xl)
const StatBox = ({ icon, label, value }) => (
  <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-slate-100 shadow-sm text-center hover:shadow-md hover:border-sky-200 transition duration-300 group">
    <div className="text-2xl text-sky-500 mb-3 group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-xl font-bold text-slate-900">{value}</span>
    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">{label}</span>
  </div>
);

export default PropertyDetails;