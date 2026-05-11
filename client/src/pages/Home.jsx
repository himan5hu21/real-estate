import { useEffect } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Listings from "../components/Listings";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { checkTokenExpiry, signOutSuccess } from "../store/user/userSlice";
import { isTokenExpired } from "../utils/auth";
import { persistor } from "../store/store";

const Home = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    dispatch(checkTokenExpiry());

    if (!token || isTokenExpired(token)) {
      dispatch(signOutSuccess());
      persistor.purge();
    }
  }, [dispatch, token]);

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* Listings Section */}
      <Listings />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* About Section */}
      <About />
      
      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Home;