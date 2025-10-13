import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import useMobileScreen from "../hooks/useMobileScreen";
import { toggleMenu } from "../store/menu/menuSlice";
import {
  requestFailure,
  requestStart,
  signOutSuccess,
} from "../store/user/userSlice";
import classNames from "classnames";
import useDropdown from "../hooks/useDropDown";
import { userSignOut } from "../services/service";

const ProfileDrop = React.memo(() => {
  const profileRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMobileScreen();
  const { currentUser } = useSelector((state) => state.user);

  const { isOpen, handleDropdownToggle, setIsOpen } = useDropdown(profileRef);

  const navigation = [
    { title: "My Profile", path: "/profile" },
    { title: "My Properties", path: "/myProperties" },
    { title: "Add Properties", path: "/addProperty" },
    { title: "Favorite Properties", path: "/favoriteProperties" },
    { title: "Log out", path: "#logout" },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    if (isMobile) {
      dispatch(toggleMenu());
    }
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
    } catch (e) {
      console.error(e);
      dispatch(requestFailure("Failed to log out due to an internal error."));
    }

    handleLinkClick();
  };

  return (
    <>
      <div className={`flex items-center space-x-4`}>
        <button
          ref={profileRef}
          className="w-10 h-10 outline-none rounded-full ring-offset-2 ring-gray-200 ring-2 md:hover:ring-gray-300 md:focus:ring-sky-700"
          onClick={handleDropdownToggle}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              className="w-full h-full rounded-full"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-300"></div>
          )}
        </button>
        <div className="md:hidden">
          <span className="block">{currentUser?.username}</span>
          <span className="block text-sm text-gray-500">
            {currentUser?.email}
          </span>
        </div>
      </div>

      {/* Drop down menu */}
      <ul
        className={classNames(
          "bg-transparent top-12 right-0 mt-5 space-y-0 md:bg-white md:absolute md:border md:rounded-md md:text-sm md:w-52 md:shadow-md md:mt-0 md:z-50",
          { "md:hidden": !isOpen, block: isOpen }
        )}
      >
        {navigation.map((item, idx) => (
          <li key={idx}>
            <NavLink
              to={item.path}
              onClick={
                item.title === "Log out" ? handleLogout : handleLinkClick
              }
              className={({ isActive }) =>
                classNames(
                  "block px-4 py-2 rounded-md transition-colors duration-300",
                  {
                    "text-gray-600": !isActive,
                    "bg-sky-700 text-white md:bg-sky-700":
                      isActive && item.title !== "Log out",
                    "hover:bg-gray-400 hover:text-white md:hover:bg-gray-100 md:hover:text-gray-600":
                      !isActive && item.title !== "Log out",
                    "text-gray-500 md:hover:bg-gray-100 md:hover:text-gray-600":
                      isActive && item.title === "Log out" && !isMobile,
                    "bg-transparent text-gray-500 hover:text-white hover:bg-gray-400":
                      item.title === "Log out" && isActive && isMobile,
                  }
                )
              }
            >
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </>
  );
});

ProfileDrop.displayName = "Profile";

export default ProfileDrop;
