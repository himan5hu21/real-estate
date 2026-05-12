import { useRef } from "react";
import { FaEdit, FaSave, FaTimes, FaCamera } from "react-icons/fa";
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineCog, HiOutlineLockClosed, HiOutlineLogout, HiOutlineTrash } from "react-icons/hi";
import { useSelector } from "react-redux";
import BlocksShuffle2 from "../assets/svgs/blocks-shuffle-2";
import PasswordModal from "../components/PasswordModel";
import useProfileForm from "../hooks/useProfileForm";
import useChangePassword from "../hooks/useChangePassword";
import { Form } from "react-router-dom";
import PropTypes from "prop-types";
import CldImage from "../components/CldImage";
import Footer from "../components/Footer";

// Reusable Input Component (Matches Properties.jsx Design)
const UserInput = ({
  title,
  type,
  name,
  value,
  isError,
  isEditing,
  handleChange,
  requiredFields,
  error,
  icon: Icon
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-bold text-slate-700 ml-1">{title}</label>
    {isEditing ? (
      <div className="relative">
        <div className={`
          flex items-center w-full bg-slate-50 border-2 rounded-xl transition-all duration-200
          ${isError ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-200 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/10'}
        `}>
          {Icon && <Icon className="ml-4 text-slate-400 text-lg" />}
          <input
            type={type}
            name={name}
            value={value || ""}
            onChange={handleChange}
            placeholder={`Enter ${title.toLowerCase()}`}
            className="w-full bg-transparent border-none outline-none focus:ring-0 text-slate-900 placeholder:text-slate-400 py-3 px-4"
            required={requiredFields.includes(name)}
          />
        </div>
        {isError && <div className="text-rose-500 text-xs mt-1 ml-1 font-medium">{error}</div>}
      </div>
    ) : (
      <div className="flex items-center gap-3 p-3.5 bg-white border border-slate-100 rounded-xl">
        {Icon && <Icon className="text-slate-400 text-lg" />}
        <span className={`text-base ${value ? 'text-slate-700' : 'text-slate-400 italic'}`}>
          {value || "Not set"}
        </span>
      </div>
    )}
  </div>
);

UserInput.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  isError: PropTypes.bool,
  isEditing: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  requiredFields: PropTypes.array.isRequired,
  error: PropTypes.string,
  icon: PropTypes.elementType,
};

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const requiredFields = ["username", "email"];
  const fileInputRef = useRef(null);

  const {
    formData,
    newImage,
    isEditing,
    fileUploadError,
    filePerc,
    handleSubmit,
    handleChange,
    handleImageChange,
    toggleEditMode,
    handleCancel,
    handleDeleteAccount,
    handleLogOut,
  } = useProfileForm(currentUser);

  const {
    isPasswordModalOpen,
    handlePasswordModalOpen,
    handlePasswordModalClose,
    handlePasswordChange,
  } = useChangePassword(currentUser);

  const isError = (keyword) => error?.toLowerCase().includes(keyword);

  const inputData = [
    { title: "Full Name", type: "text", name: "name", value: isEditing ? formData.name : currentUser.name, icon: HiOutlineUser },
    { title: "Username", type: "text", name: "username", value: isEditing ? formData.username : currentUser.username, isError: isError("username"), icon: HiOutlineUser },
    { title: "Email Address", type: "email", name: "email", value: isEditing ? formData.email : currentUser.email, isError: isError("email"), icon: HiOutlineMail },
    { title: "Phone Number", type: "tel", name: "phone", value: isEditing ? formData.phone : currentUser.phone, isError: isError("phone"), icon: HiOutlinePhone },
    { title: "Address", type: "text", name: "address", value: isEditing ? formData.address : currentUser.address, icon: HiOutlineLocationMarker },
    { title: "Preferences", type: "text", name: "preferences", value: isEditing ? formData.preferences : currentUser.preferences, icon: HiOutlineCog },
  ];

  // Helper for Security Buttons
  const SecurityButton = ({ title, description, icon: Icon, onClick, variant = "default" }) => (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center justify-between w-full p-4 rounded-xl border-2 transition-all duration-200 group
        ${variant === 'danger' 
          ? 'border-rose-100 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-200' 
          : 'border-slate-100 bg-white hover:border-sky-200 hover:shadow-md'}
      `}
    >
      <div className="flex items-center gap-4 text-left">
        <div className={`p-2 rounded-lg ${variant === 'danger' ? 'bg-white text-rose-500' : 'bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600'}`}>
          <Icon className="text-xl" />
        </div>
        <div>
          <h4 className={`font-bold ${variant === 'danger' ? 'text-rose-700' : 'text-slate-700 group-hover:text-sky-700'}`}>{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="text-slate-400">
        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. HEADER BANNER */}
      <div className="relative bg-gradient-to-r from-sky-600 to-cyan-600 text-white pt-24 pb-32 px-4">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">Account Settings</h1>
          <p className="text-xl text-sky-100 max-w-2xl mx-auto">Manage your profile, security preferences, and personal details.</p>
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Avatar & Status */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 text-center">
              <div className="relative inline-block group">
                <CldImage
                  src={newImage || currentUser.avatar || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg mx-auto transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Image Upload Overlay */}
                {isEditing && (
                  <label 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  >
                    <FaCamera className="text-white text-2xl" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              {/* Upload Status */}
              <div className="mt-4 min-h-[20px]">
                {fileUploadError ? (
                  <span className="text-xs text-rose-500 font-bold bg-rose-50 px-2 py-1 rounded-md">Error: Image too large (max 2MB)</span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2">
                    <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: `${filePerc}%` }}></div>
                    <span className="text-xs text-slate-500 mt-1 block">Uploading {filePerc}%</span>
                  </div>
                ) : filePerc === 100 ? (
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">Image uploaded successfully!</span>
                ) : null}
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-bold text-slate-900">{currentUser.name || "User"}</h2>
                <p className="text-slate-500">@{currentUser.username}</p>
                <div className="mt-4 flex justify-center gap-2">
                  <span className="px-3 py-1 bg-sky-50 text-sky-700 text-xs font-bold rounded-full uppercase tracking-wider">Member</span>
                  {currentUser.isAgent && <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">Agent</span>}
                </div>
              </div>
            </div>

            {/* Quick Actions (Desktop only usually, but good here) */}
            <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Security & Account</h3>
              <SecurityButton 
                title="Change Password" 
                description="Update your secure password" 
                icon={HiOutlineLockClosed} 
                onClick={handlePasswordModalOpen} 
              />
              <SecurityButton 
                title="Sign Out" 
                description="Securely log out of your account" 
                icon={HiOutlineLogout} 
                onClick={handleLogOut} 
              />
              <SecurityButton 
                title="Delete Account" 
                description="Permanently remove your data" 
                icon={HiOutlineTrash} 
                onClick={handleDeleteAccount} 
                variant="danger" 
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Edit Form */}
          <div className="lg:col-span-2">
            <Form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 h-full relative overflow-hidden">
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
                  <p className="text-slate-500 text-sm mt-1">Update your personal details and public profile.</p>
                </div>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={toggleEditMode}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md hover:-translate-y-0.5"
                  >
                    <FaEdit /> <span>Edit Profile</span>
                  </button>
                )}
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                {inputData.map((data) => (
                  <UserInput 
                    key={data.name} 
                    {...data} 
                    isEditing={isEditing} 
                    handleChange={handleChange}
                    requiredFields={requiredFields}
                    error={error}
                  />
                ))}
              </div>

              {/* Action Buttons (Only visible when editing) */}
              {isEditing && (
                <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-end gap-4 animate-in fade-in slide-in-from-bottom-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all disabled:opacity-50"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <BlocksShuffle2 className="w-5 h-5 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <FaSave /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </Form>
          </div>

        </div>
      </div>

      <Footer />

      {/* Render the Password Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={handlePasswordModalClose}
        onSubmit={handlePasswordChange}
      />
    </div>
  );
};

export default Profile;