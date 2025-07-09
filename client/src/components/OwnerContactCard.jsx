import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

const OwnerContactCard = ({ ownerId }) => {
  const [ownerDetails, setOwnerDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/listing/owner/${ownerId}`);
        setOwnerDetails(res.data.owner);
      } catch (err) {
        console.error("Error fetching property details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [ownerId]);

  if (loading)
    return (
      <p className="mt-6 text-gray-500 italic">Loading owner details...</p>
    );

  if (!ownerDetails)
    return <p className="mt-6 text-red-500">Failed to load owner info.</p>;

  console.log(ownerDetails);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-10 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
        Listed by Owner
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-xl font-bold">
          {ownerDetails.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <div className="flex items-baseline gap-1 text-md font-medium text-gray-800">
            <FaUser className="text-sky-700" />
            {ownerDetails.name}
          </div>
          <div className="text-sm text-gray-500">Property Owner</div>
        </div>
      </div>

      <div className="space-y-3 mt-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-sky-600" />
          <span>{ownerDetails.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaPhone className="text-sky-600" />
          <span>{ownerDetails.phone}</span>
        </div>
      </div>
    </div>
  );
};

OwnerContactCard.propTypes = {
  ownerId: PropTypes.string.isRequired,
};

export default OwnerContactCard;
