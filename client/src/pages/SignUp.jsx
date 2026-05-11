import { Form, Link } from "react-router-dom";
import BlocksShuffle2 from "../assets/svgs/blocks-shuffle-2";
import useAuth from "../hooks/useAuth";
import { requestStart, requestFailure, signUpSuccess } from "../store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import QAuth from "../components/QAuth";
import useProfileForm from "../hooks/useProfileForm";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { useState } from "react";

function SignUp() {
  const { loading, error } = useSelector((state) => state.user);
  const { handleAuth } = useAuth();
  const { formData, handleChange } = useProfileForm();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState({
    pass: false,
    confirm: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formObject = Object.fromEntries(data);

    if (formObject.password !== formObject.confirmPassword) {
      dispatch(requestFailure("Passwords do not match"));
      return;
    }

    delete formObject.confirmPassword;
    handleAuth(
      "/api/auth/signup",
      formObject,
      requestStart,
      signUpSuccess,
      requestFailure,
      "/sign-in"
    );
  };

  const isError = (keyword) => error?.toLowerCase().includes(keyword);

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left: Decorative Image Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-900/90 to-slate-900/90"></div>
        <div className="relative z-10 text-center px-12">
          <h2 className="text-4xl font-bold text-white mb-6 font-display">Join KeyHaven</h2>
          <p className="text-sky-100 text-lg leading-relaxed max-w-md mx-auto">
            Create an account to start your real estate journey. Buy, sell, or rent properties with ease.
          </p>
        </div>
      </div>

      {/* Right: Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 my-4">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500">Get started with your free account</p>
          </div>

          <Form method="POST" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Username</label>
              <div className="relative flex items-center">
                <HiOutlineUser className="absolute left-4 text-slate-400 text-xl" />
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Choose a username"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-xl outline-none focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 ${isError("username") ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-200 focus:border-sky-500'}`}
                  onChange={handleChange}
                />
              </div>
              {isError("username") && <div className="text-rose-500 text-xs mt-1 ml-1">{error}</div>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
              <div className="relative flex items-center">
                <HiOutlineMail className="absolute left-4 text-slate-400 text-xl" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 rounded-xl outline-none focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 ${isError("email") ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-200 focus:border-sky-500'}`}
                  onChange={handleChange}
                />
              </div>
              {isError("email") && <div className="text-rose-500 text-xs mt-1 ml-1">{error}</div>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
              <div className="relative flex items-center">
                <HiOutlineLockClosed className="absolute left-4 text-slate-400 text-xl" />
                <input
                  type={showPassword.pass ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Create a password"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({...prev, pass: !prev.pass}))}
                  className="absolute right-4 text-slate-400 hover:text-sky-600 transition-colors outline-none"
                >
                  {showPassword.pass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Confirm Password</label>
              <div className="relative flex items-center">
                <HiOutlineLockClosed className="absolute left-4 text-slate-400 text-xl" />
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Confirm password"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => ({...prev, confirm: !prev.confirm}))}
                  className="absolute right-4 text-slate-400 hover:text-sky-600 transition-colors outline-none"
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Generic Error */}
            {!["username", "email"].some((keyword) => isError(keyword)) && error?.trim().length > 0 && (
              <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl text-center font-medium border border-rose-100">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <BlocksShuffle2 className="w-5 h-5" /> : "Sign Up"}
            </button>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400 font-medium">Or sign up with</span>
            </div>
          </div>

          <QAuth />

          <p className="mt-8 text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link to="/sign-in" className="font-bold text-sky-600 hover:text-sky-700 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;