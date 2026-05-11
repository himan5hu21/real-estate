import { useState } from "react";
import GoogleLogo from "../assets/svgs/google-logo";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase/firebaseConfig";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";

function QAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOnClick = async () => {
    if (loading) return; // Prevent multiple clicks

    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log("Successfully signed in with Google", result);

      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        imageUrl: result.user.photoURL,
      };

      const res = await axios.post("/api/auth/google", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("res:", res);
      dispatch(signInSuccess(res.data));
      navigate("/", { replace: true });
    } catch (error) {
      console.log("Could not sign in with Google", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <button
        type="button"
        disabled={loading}
        onClick={handleOnClick}
        className={`w-full flex items-center justify-center gap-x-3 py-2.5 mt-5 border rounded-lg text-sm font-medium duration-150 ${
          loading 
            ? "bg-gray-100 cursor-not-allowed opacity-70" 
            : "hover:bg-gray-50 active:bg-gray-100"
        }`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Connecting...</span>
          </div>
        ) : (
          <>
            <GoogleLogo />
            Continue with Google
          </>
        )}
      </button>
    </div>
  );
}

export default QAuth;
