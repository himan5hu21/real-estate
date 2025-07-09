import { useEffect } from "react";
import About from "../components/About";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Listings from "../components/Listings";
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
      <About />
      <Footer />
    </>
  );
};

export default Home;
