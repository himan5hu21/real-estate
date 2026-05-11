import { useState, useEffect } from "react";
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineLockClosed, HiX } from "react-icons/hi";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import BlocksShuffle2 from "../assets/svgs/blocks-shuffle-2";

// 1. REDESIGNED INPUT COMPONENT
const PasswordInput = ({
  title,
  name,
  visible,
  value,
  onChange,
  toggleVisibility,
}) => (
  <div className="mb-5">
    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
      {title}
    </label>
    <div className="relative group">
      <div className="flex items-center w-full bg-slate-50 border-2 border-slate-200 rounded-xl focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-500/10 transition-all duration-200">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent border-none outline-none focus:ring-0 text-slate-900 placeholder:text-slate-400 py-3.5 px-4 font-medium"
          placeholder={`Enter ${title.toLowerCase()}`}
          autoComplete="new-password"
          required
        />
        <button
          type="button"
          className="p-3 mr-1 text-slate-400 hover:text-sky-600 transition-colors outline-none rounded-lg"
          onClick={() => toggleVisibility(name)}
          tabIndex="-1"
        >
          {visible ? <HiOutlineEyeOff className="text-xl" /> : <HiOutlineEye className="text-xl" />}
        </button>
      </div>
    </div>
  </div>
);

PasswordInput.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  toggleVisibility: PropTypes.func.isRequired,
};

const PasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const { loading, error } = useSelector((state) => state.user);

  const [passwords, setPasswords] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errorMessage, setErrorMessage] = useState("");

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPasswords({
        username: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrorMessage("");
      setShowPassword({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string to clear input, but trim for logic if needed
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }
    
    if (passwords.newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setErrorMessage("");
    const val = await onSubmit(passwords);
    if (val?.success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center text-sky-600">
              <HiOutlineLockClosed className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
              <p className="text-sm text-slate-500">Secure your account</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <HiX className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-8">
          {/* Hidden Username Field for Accessibility/Managers */}
          <input
            type="text"
            name="username"
            value={passwords.username}
            onChange={handleChange}
            autoComplete="username"
            className="hidden"
          />

          <PasswordInput
            title="Current Password"
            name="currentPassword"
            visible={showPassword.currentPassword}
            value={passwords.currentPassword}
            onChange={handleChange}
            toggleVisibility={toggleShowPassword}
          />

          <div className="h-px bg-slate-100 my-6" />

          <PasswordInput
            title="New Password"
            name="newPassword"
            visible={showPassword.newPassword}
            value={passwords.newPassword}
            onChange={handleChange}
            toggleVisibility={toggleShowPassword}
          />

          <PasswordInput
            title="Confirm New Password"
            name="confirmPassword"
            visible={showPassword.confirmPassword}
            value={passwords.confirmPassword}
            onChange={handleChange}
            toggleVisibility={toggleShowPassword}
          />

          {(errorMessage || error) && (
            <div className="bg-rose-50 text-rose-600 text-sm font-medium px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errorMessage || error}
            </div>
          )}

          <div className="flex items-center gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center items-center px-4 py-3.5 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <BlocksShuffle2 className="w-6 h-6 animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

PasswordModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default PasswordModal;