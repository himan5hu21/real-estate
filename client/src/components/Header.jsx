import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleMenu } from "../store/menu/menuSlice";
import useMobileScreen from "../hooks/useMobileScreen";
import classNames from "classnames";
import ProfileDropDown from "./ProfileDropDown";
import { HiOutlineSearch, HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const Header = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.menu.isOpen);
  const isMobile = useMobileScreen();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleMenu = () => {
    if (isMobile) dispatch(toggleMenu());
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
    <>
      <nav
        className={classNames(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          {
            "bg-white/80 backdrop-blur-md border-slate-200/50 shadow-sm py-3": isScrolled,
            "bg-transparent border-transparent py-5": !isScrolled,
          }
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-sky-600 to-cyan-600 text-white p-2 rounded-xl shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Key<span className="bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">Haven</span>
              </span>
            </NavLink>

            {/* Desktop Center Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-slate-200/50">
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    classNames(
                      "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                      {
                        "bg-slate-900 text-white shadow-md": isActive,
                        "text-slate-600 hover:text-slate-900 hover:bg-slate-100": !isActive,
                      }
                    )
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Desktop Search */}
              <form
                onSubmit={handleSearch}
                className="hidden lg:flex items-center bg-white border border-slate-200 rounded-full pl-4 pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 transition-all duration-300 w-64 shadow-sm"
              >
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
                />
                <button type="submit" className="bg-slate-900 text-white p-2 rounded-full hover:bg-slate-800 transition-colors">
                   <HiOutlineSearch className="w-4 h-4" />
                </button>
              </form>

              {/* Search Toggle Mobile */}
              <button
                onClick={() => navigate('/properties')}
                className="lg:hidden text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <HiOutlineSearch className="w-6 h-6" />
              </button>

              {/* Profile Dropdown (Desktop) */}
              <div className="hidden md:block pl-3 ml-1 border-l border-slate-200">
                <ProfileDropDown />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={handleToggleMenu}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={classNames(
          "fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          { "opacity-100": isOpen, "opacity-0 pointer-events-none": !isOpen }
        )}
        onClick={handleToggleMenu}
      />
      
      <div
        className={classNames(
          "fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col",
          { "translate-x-0": isOpen, "translate-x-full": !isOpen }
        )}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="font-bold text-xl text-slate-900">Menu</span>
          <button onClick={handleToggleMenu} className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-slate-900 shadow-sm">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          {navigation.map((item) => (
             <NavLink
               key={item.path}
               to={item.path}
               onClick={handleToggleMenu}
               className={({ isActive }) => classNames(
                 "block px-5 py-4 rounded-2xl text-base font-medium transition-all duration-200 border",
                 {
                   "bg-slate-900 text-white border-slate-900 shadow-md": isActive,
                   "bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:text-slate-900": !isActive
                 }
               )}
             >
               {item.title}
             </NavLink>
          ))}
        </div>

        <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/50">
          <ProfileDropDown class="w-full" />
        </div>
      </div>
      
      {/* Spacing for fixed header */}
      <div className={classNames("transition-all duration-300", { "h-20": isScrolled, "h-24": !isScrolled })} />
    </>
  );
};

export default Header;