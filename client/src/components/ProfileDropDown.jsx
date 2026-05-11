import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineArrowRight } from "react-icons/hi";
import ProfileDrop from "./ProfileDrop";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenu } from "../store/menu/menuSlice";
import useMobileScreen from "../hooks/useMobileScreen";
import classNames from "classnames";

const ProfileDropDown = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMobileScreen();
  const { currentUser } = useSelector((state) => state.user);

  const handleToggleMenu = () => {
    if (isMobile) dispatch(toggleMenu());
    navigate("/sign-in");
  };

  return (
    <div className={`relative ${props.class || ""}`}>
      {currentUser ? (
        <ProfileDrop />
      ) : (
        <div className={classNames("flex gap-3", { "flex-col": isMobile, "flex-row items-center": !isMobile })}>
          <button
            onClick={handleToggleMenu}
            className={classNames(
              "group flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300",
              {
                "bg-gradient-to-r from-sky-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-sky-500/30 px-6 py-2.5 text-sm hover:-translate-y-0.5": !isMobile,
                "bg-gradient-to-r from-sky-600 to-cyan-600 text-white w-full py-4 rounded-2xl shadow-md": isMobile,
              }
            )}
          >
            <span>Sign In</span>
            {!isMobile && <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>

          {!isMobile && (
            <NavLink
              to="/sign-up"
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 px-4 py-2 transition-colors"
            >
              Sign Up
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
};

ProfileDropDown.propTypes = {
  class: PropTypes.string,
};

export default ProfileDropDown;