import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import useMobileScreen from "../hooks/useMobileScreen";
import { toggleMenu } from "../store/menu/menuSlice";
import { requestFailure, requestStart, signOutSuccess } from "../store/user/userSlice";
import classNames from "classnames";
import useDropdown from "../hooks/useDropDown";
import { userSignOut } from "../services/service";
import { 
  HiOutlineUser, 
  HiOutlineHome, 
  HiOutlinePlus, 
  HiOutlineHeart, 
  HiOutlineLogout,
  HiChevronDown
} from "react-icons/hi";

const ProfileDrop = React.memo(() => {
  const profileRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMobileScreen();
  const { currentUser } = useSelector((state) => state.user);
  const { isOpen, handleDropdownToggle, setIsOpen } = useDropdown(profileRef);

  const navigation = [
    { title: "My Profile", path: "/profile", icon: <HiOutlineUser className="w-5 h-5" /> },
    { title: "My Properties", path: "/myProperties", icon: <HiOutlineHome className="w-5 h-5" /> },
    { title: "Add Property", path: "/addProperty", icon: <HiOutlinePlus className="w-5 h-5" /> },
    { title: "Favorites", path: "/favoriteProperties", icon: <HiOutlineHeart className="w-5 h-5" /> },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    if (isMobile) dispatch(toggleMenu());
  };

  const handleLogout = async () => {
    dispatch(requestStart());
    try {
      const res = await userSignOut();
      const data = await res.data;
      if (!data.success) {
        dispatch(requestFailure(data.message));
        return;
      }
      dispatch(signOutSuccess());
      navigate("/", { replace: true });
    } catch {
      dispatch(requestFailure("Failed to log out."));
    }
    handleLinkClick();
  };

  return (
    <div className="relative" ref={profileRef}>
      {/* Trigger Button */}
      <button
        onClick={handleDropdownToggle}
        className={classNames(
          "flex items-center gap-2 transition-all duration-200 group",
          {
            "p-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-md bg-white pr-4": !isMobile,
            "w-full bg-white border border-slate-200 p-4 rounded-2xl shadow-sm": isMobile,
          }
        )}
      >
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-600 to-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}
        
        {!isMobile ? (
          <HiChevronDown className={classNames("w-4 h-4 text-slate-400 transition-transform group-hover:text-slate-600", { "rotate-180": isOpen })} />
        ) : (
          <div className="flex flex-col text-left ml-3">
            <span className="text-sm font-bold text-slate-900">{currentUser?.username}</span>
            <span className="text-xs text-slate-500">{currentUser?.email}</span>
          </div>
        )}
      </button>

      {/* Desktop Dropdown */}
      {!isMobile && (
        <div
          className={classNames(
            "absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 ring-1 ring-black/5 transform transition-all duration-200 origin-top-right z-50",
            {
              "opacity-100 scale-100 translate-y-0": isOpen,
              "opacity-0 scale-95 -translate-y-2 pointer-events-none": !isOpen,
            }
          )}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
            <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.username}</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{currentUser?.email}</p>
          </div>

          {/* Links */}
          <div className="p-2 space-y-1">
            {navigation.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  classNames(
                    "flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200",
                    {
                      "text-sky-700 bg-sky-50 font-medium": isActive,
                      "text-slate-600 hover:bg-slate-50 hover:text-slate-900": !isActive,
                    }
                  )
                }
              >
                {item.icon}
                {item.title}
              </NavLink>
            ))}
          </div>

          {/* Logout */}
          <div className="p-2 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-medium"
            >
              <HiOutlineLogout className="w-5 h-5" />
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Mobile Links */}
      {isMobile && isOpen && (
        <div className="mt-3 space-y-2 pl-1">
          {navigation.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) => classNames(
                "flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium border transition-all",
                {
                  "bg-sky-50 text-sky-700 border-sky-100": isActive,
                  "bg-white text-slate-600 border-transparent hover:bg-slate-50": !isActive
                }
              )}
            >
              {item.icon}
              {item.title}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors"
          >
            <HiOutlineLogout className="w-5 h-5" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
});

ProfileDrop.displayName = "ProfileDrop";
export default ProfileDrop;