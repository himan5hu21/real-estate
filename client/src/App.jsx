// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
// import About from "./pages/About";
// import Profile from "./pages/Profile";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
// import PrivateRoute from "./components/PrivateRoute";
// import AddProperty from "./pages/AddProperties";
// import Error from "./pages/Error";
// import Properties from "./pages/Properties";

import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "./store/user/userSlice";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          dispatch(signOutSuccess());
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [dispatch]);

  // Define routes where the header should NOT appear
  const noHeaderRoutes = ["/sign-in", "/sign-up"];

  // Check if current path matches any in the list
  const showHeader = !noHeaderRoutes.includes(location.pathname);
  return (
    // <BrowserRouter>
    //   <Header />
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/sign-in" element={<SignIn />} />
    //     <Route path="/sign-up" element={<SignUp />} />
    //     <Route path="/about" element={<About />} />
    //     <Route path="/properties" element={<Properties />} />
    //     <Route
    //       path="/profile"
    //       element={
    //         <PrivateRoute>
    //           <Profile />
    //         </PrivateRoute>
    //       }
    //     />
    //     <Route
    //       path="/addProperty"
    //       element={
    //         <PrivateRoute>
    //           <AddProperty />
    //         </PrivateRoute>
    //       }
    //     />
    //     <Route path="*" element={<Error />} />
    //   </Routes>
    // </BrowserRouter>

    <>
      <div className="min-h-screen bg-white">
        {/* Header - Fixed position handled internally */}
        {showHeader && <Header />}

        {/* Main Content */}
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
