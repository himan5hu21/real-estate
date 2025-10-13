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

  return (
    <>
      <Hero />
      <Features />
      <Listings />
      <Testimonials />
      <About />
      <Footer />
    </>
  );
};

export default Home;
