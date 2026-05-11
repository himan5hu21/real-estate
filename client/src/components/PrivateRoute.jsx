import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const { currentUser, token } = useSelector((state) => state.user);
  const location = useLocation();

  // Security Check: User must exist AND have a token
  if (!currentUser || !token) {
    // Redirect to sign-in, but save the current location they were trying to access
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;