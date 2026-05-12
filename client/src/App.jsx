// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
// import About from "./pages/About";
// import Profile from "./pages/Profile";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import { useEffect, Suspense } from "react";
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

  // Simple loading fallback
  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header - Fixed position handled internally */}
        {showHeader && <Header />}

        {/* Main Content */}
        <main>
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </>
  );
}

export default App;
