import logo from "../assets/images/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import ProfileDropDown from "./ProfileDropDown";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleMenu } from "../store/menu/menuSlice";
import useMobileScreen from "../hooks/useMobileScreen";
import classNames from "classnames";
import { useState } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.menu.isOpen);
  const isMobile = useMobileScreen();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleMenu = () => {
    if (isMobile) {
      dispatch(toggleMenu());
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const navigation = [
    { title: "Home", path: "/" },
    { title: "Properties", path: "/properties" },
    { title: "About", path: "/about" },
  ];
  return (
    <nav className="bg-slate-200 shadow-md border-b">
      {/* Header */}
      <div className="flex items-center space-x-8 py-3 px-4 max-w-screen-xl mx-auto md:px-8">
        {/* Logo */}
        <div className="flex-none md:flex-initial">
          <NavLink
            to="/"
            className={({ isActive, isPending }) =>
              `nav-link flex items-center gap-3 text-2xl font-semibold ${
                isActive ? "text-sky-700" : isPending ? "text-gray-600" : ""
              }`
            }
          >
            <img src={logo} alt="Float UI logo" className="w-16 sm:w-20" />
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
              <span className="text-sky-700">Key</span>
              <span className="text-slate-700">Haven</span>
            </h1>
          </NavLink>
        </div>

        <div className="flex-1 flex items-center justify-between">
          {/* Mobile Menu Close Button */}
          <div
            className={classNames(
              "bg-slate-200 z-20 p-4 border-l border-gray-400 transition-transform",
              {
                "fixed top-0 right-0 w-3/4 sm:w-1/2 h-full z-50": isMobile,
                "absolute w-full top-16 left-0 border-b md:static md:block md:border-none":
                  !isMobile,
                "translate-x-0": isOpen,
                "translate-x-full": !isOpen && isMobile,
                hidden: !isOpen && !isMobile,
              }
            )}
          >
            <div className="flex justify-end md:hidden">
              <button
                onClick={handleToggleMenu}
                className="outline-none text-gray-400 block hover:text-sky-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation List */}
            {currentUser && (
              <ProfileDropDown class="mb-5 pb-5 border-b border-gray-400 md:hidden" />
            )}

            <ul className="mt-6 space-y-0 md:flex md:space-x-6 md:mt-0  ">
              {navigation.map((item, idx) => (
                <li
                  key={idx}
                  className={isMobile ? "" : "text-gray-600 hover:text-sky-600"}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive, isPending }) =>
                      classNames("nav-link transition-colors duration-300", {
                        "block px-4 py-2 rounded-md hover:text-white": isMobile,
                        "hover:bg-gray-400": !isActive && isMobile,
                        "text-gray-600": !isActive && !isPending,
                        "bg-sky-700 text-white": isActive && isMobile,
                        "text-sky-700 font-medium border-b-2 border-sky-700":
                          isActive && !isMobile,
                        "md:hover:text-sky-600": !isActive && !isMobile,
                      })
                    }
                    onClick={handleToggleMenu}
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>

            {!currentUser && (
              <ProfileDropDown class="mt-5 pt-5 border-t border-gray-400 md:hidden" />
            )}
          </div>

          {/* Navigation Open Button */}
          <div
            className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10 transition-all duration-500 ${
              isOpen ? "block" : "hidden"
            }`}
            onClick={handleToggleMenu}
          ></div>

          <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-6">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex items-center space-x-2 border bg-white rounded-md p-2 hover:border-sky-700 focus-within:border-sky-700">
              <input
                className="w-full mx-2 bg-transparent outline-none appearance-none placeholder-gray-500 text-gray-500 sm:w-auto"
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="px-2 w-10 cursor-pointer hover:text-sky-700 transition-colors">
                <FaSearch />
              </button>
            </form>

            {/* Profile Dropdown */}
            <ProfileDropDown class="hidden md:block" />

            {/* Mobile Menu Open Button */}
            <button
              className="outline-none text-gray-400 hover:text-sky-600 block md:hidden"
              onClick={handleToggleMenu}
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
