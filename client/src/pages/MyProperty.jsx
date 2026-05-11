import axios from "axios";
import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlinePlus, 
  HiOutlineHome,
  HiOutlineCollection,
  HiOutlineViewGrid
} from "react-icons/hi";

function MyProperty() {
  const userId = useSelector((state) => state.user.currentUser._id);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/user/listings/${userId}`);
        setProperties(res.data.listings || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [userId]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await axios.delete(`/api/listing/delete/${id}`);
      const data = await res.data;

      if (!data.success) {
        alert("Failed to delete property. Please try again.");
        return;
      }

      setProperties((prevProperties) =>
        prevProperties.filter((p) => p._id !== id)
      );
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. NEW DASHBOARD HEADER DESIGN */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-8 px-4 shadow-sm relative z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            {/* Title Section */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-600 mb-2 uppercase tracking-wide">
                <HiOutlineViewGrid className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                My Properties
              </h1>
              <p className="text-slate-500 mt-2 max-w-lg text-lg">
                Manage your portfolio, track your listings, and keep your property details up to date.
              </p>
            </div>

            {/* Action Button */}
            {properties.length > 0 && (
              <button
                onClick={() => navigate("/addProperty")}
                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md"
              >
                <HiOutlinePlus className="w-5 h-5" /> 
                List New Property
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        
        {properties.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-16 text-center max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineHome className="w-12 h-12 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              No Properties Listed Yet
            </h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              You haven't listed any properties yet. Start your journey by adding your first property to showcase it to potential buyers or renters.
            </p>
            <button
              onClick={() => navigate("/addProperty")}
              className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <HiOutlinePlus className="w-5 h-5" /> 
              List Your First Property
            </button>
          </div>
        ) : (
          /* Property Grid - UNCHANGED DESIGN */
          <>
            <div className="flex items-center gap-3 mb-8 px-1">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                <HiOutlineCollection className="w-5 h-5 text-sky-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Active Listings <span className="text-slate-400 font-medium ml-1">({properties.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {properties.map((property) => (
                <div key={property._id} className="relative group">
                  {/* The Listing Card - UNTOUCHED DESIGN */}
                  <PropertyCard
                    property={property}
                    showHeartIcon={false} // We hide heart to make room for edit/delete
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    <button
                      onClick={(e) => {
                        e.preventDefault(); 
                        e.stopPropagation();
                        navigate(`/editProperty/${property._id}`);
                      }}
                      className="bg-white text-sky-600 p-2.5 rounded-full shadow-lg hover:bg-sky-600 hover:text-white transition-all hover:scale-110"
                      title="Edit Property"
                    >
                      <HiOutlinePencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(property._id);
                      }}
                      className="bg-white text-rose-500 p-2.5 rounded-full shadow-lg hover:bg-rose-500 hover:text-white transition-all hover:scale-110"
                      title="Delete Property"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default MyProperty;