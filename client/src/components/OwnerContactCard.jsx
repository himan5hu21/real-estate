import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { HiOutlineMail, HiOutlinePhone, HiUser } from "react-icons/hi";

const OwnerContactCard = ({ ownerId }) => {
  const [ownerDetails, setOwnerDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/listing/owner/${ownerId}`);
        setOwnerDetails(res.data.owner);
      } catch (err) {
        console.error("Error fetching owner details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [ownerId]);

  if (loading)
    return (
      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl animate-pulse">
        <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-3 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>
    );

  if (error || !ownerDetails)
    return (
      <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-medium text-center border border-rose-100">
        Unable to load owner information.
      </div>
    );

  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 transition-all duration-300">
      <div className="flex items-center gap-4 mb-5">
        {/* Avatar / Initial */}
        {ownerDetails.avatar ? (
          <img 
            src={ownerDetails.avatar} 
            alt={ownerDetails.name} 
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white text-xl font-bold shadow-sm border-2 border-white">
            {ownerDetails.name?.[0]?.toUpperCase() || <HiUser />}
          </div>
        )}
        
        {/* Name & Role */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {ownerDetails.name || "Property Owner"}
          </h3>
          <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide mt-0.5">
            Verified Owner
          </p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm group hover:border-sky-200 transition-colors">
          <div className="p-2 bg-sky-50 text-sky-600 rounded-lg group-hover:bg-sky-100 transition-colors">
            <HiOutlineMail className="text-lg" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Email</p>
            <a href={`mailto:${ownerDetails.email}`} className="text-sm font-semibold text-slate-700 hover:text-sky-600 truncate block transition-colors">
              {ownerDetails.email}
            </a>
          </div>
        </div>

        {ownerDetails.phone && (
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm group hover:border-sky-200 transition-colors">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <HiOutlinePhone className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Phone</p>
              <a href={`tel:${ownerDetails.phone}`} className="text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors">
                {ownerDetails.phone}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

OwnerContactCard.propTypes = {
  ownerId: PropTypes.string.isRequired,
};

export default OwnerContactCard;