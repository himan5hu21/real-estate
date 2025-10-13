import axios from "axios";
import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { useSelector } from "react-redux";
import { FaRegEdit, FaPlus, FaHome } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

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
        console.error("Error deleting property:", data.message);
        alert("Failed to delete property. Please try again.");
        return;
      }

      setProperties((prevProperties) =>
        prevProperties.filter((p) => p._id !== id)
      );
      alert("Property deleted successfully!");
    } catch (error) {
      console.error(
        "Error deleting property:",
        error.response?.data?.message || error.message
      );
      alert("Failed to delete property. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
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
            My Properties
          </h1>
          <p className="text-xl text-sky-100 max-w-2xl mx-auto mb-8">
            Manage and view all your listed properties in one place
          </p>
          <button
            onClick={() => navigate("/addProperty")}
            className="bg-white text-sky-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
          >
            <FaPlus /> Add New Property
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {properties.length === 0 ? (
          <div className="text-center py-16">
            <FaHome className="mx-auto mb-6 text-6xl text-gray-300" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              No Properties Yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't listed any properties yet. Start by adding your first property to showcase it to potential buyers or renters.
            </p>
            <button
              onClick={() => navigate("/addProperty")}
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
            >
              <FaPlus /> Add Your First Property
            </button>
          </div>
        ) : (
          <>
            {/* Properties Grid */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Your Properties ({properties.length})
              </h2>
              <p className="text-gray-600">
                Manage your property listings, edit details, or remove them as needed.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <div key={property._id} className="relative group">
                  <PropertyCard
                    property={property}
                    showHeartIcon={false}
                    isMyProperty={true}
                  />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="bg-white/90 hover:bg-white text-sky-600 p-2 rounded-full shadow-md transition-colors"
                      onClick={() => navigate(`/edit-property/${property._id}`)}
                      title="Edit Property"
                    >
                      <FaRegEdit className="w-4 h-4" />
                    </button>
                    <button
                      className="bg-white/90 hover:bg-white text-red-600 p-2 rounded-full shadow-md transition-colors"
                      onClick={() => handleDelete(property._id)}
                      title="Delete Property"
                    >
                      <BiTrash className="w-4 h-4" />
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
