import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBed,
  FaBath,
  FaUsers,
  FaMapMarkerAlt,
  FaRupeeSign,
} from "react-icons/fa";
import OwnerContactCard from "../components/OwnerContactCard";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOwner, setShowOwner] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/listing/list/${id}`);
        setProperty(res.data.listing);
      } catch (err) {
        console.error("Error fetching property details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!property)
    return (
      <div className="text-center py-10 text-red-500">Property not found.</div>
    );

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Hero Image */}
        <div className="w-full h-[400px] overflow-hidden">
          <img
            src={imageUrls[0]}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Info */}
        <div className="p-6">
          {/* Title + Location + Price */}
          <h1 className="text-3xl font-bold text-gray-800">{name}</h1>

          <div className="text-gray-600 flex items-center gap-2 mt-2">
            <FaMapMarkerAlt className="text-red-500" />
            <span>
              {address?.streetAddress}, {address?.city}, {address?.state},{" "}
              {address?.country}
            </span>
          </div>

          {/* Type and Category Badges */}
          <div className="mt-3 flex flex-wrap gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                type === "buy"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {type === "buy" ? "For Sale" : "For Rent"}
            </span>

            <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium shadow-sm">
              {category}
            </span>

            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium shadow-sm">
              {area}
            </span>
          </div>

          {/* Price */}
          <div className="text-sky-700 text-2xl font-bold mt-4 flex items-center">
            <FaRupeeSign /> <span className="ml-1">{price}</span>
            {type === "rent" && <span className="ml-2 text-base">/month</span>}
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`property-${index}`}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 text-gray-700 border px-5 py-3 rounded shadow-sm bg-slate-50">
              <FaBed className="text-xl text-sky-600" />
              <p>{bedrooms} Bedrooms</p>
            </div>
            <div className="flex items-center gap-3 text-gray-700 border px-5 py-3 rounded shadow-sm bg-slate-50">
              <FaBath className="text-xl text-sky-600" />
              <p>{bathrooms} Bathrooms</p>
            </div>
            <div className="flex items-center gap-3 text-gray-700 border px-5 py-3 rounded shadow-sm bg-slate-50">
              <FaUsers className="text-xl text-sky-600" />
              <p>{guestrooms} Guests</p>
            </div>
            <div className="flex items-center gap-3 text-gray-700 border px-5 py-3 rounded shadow-sm bg-slate-50">
              <FaBed className="text-xl text-sky-600" />
              <p>{beds} Beds</p>
            </div>
          </div>

          {/* Amenities */}
          {/* Amenities */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              Amenities
            </h2>
            {features && features.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {features.map((item, index) => (
                  <span
                    key={index}
                    className="px-4 py-1 bg-gray-200 rounded-full text-sm text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                No amenities listed.
              </p>
            )}
          </div>

          {/* CTA */}
          {/* Contact Owner Button */}
          <div className="mt-12 flex justify-start">
            <button
              onClick={() => setShowOwner((prev) => !prev)}
              className="px-6 py-3 bg-sky-700 text-white rounded-lg hover:bg-sky-600 transition"
            >
              {showOwner ? "Hide Contact" : "Contact Owner"}
            </button>
          </div>

          {/* Owner Contact Card */}
          {console.log(userRef)}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showOwner
                ? "max-h-[1000px] opacity-100 mt-4"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-6 bg-white rounded-xl shadow-md border mt-4">
              <OwnerContactCard ownerId={property.userRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
