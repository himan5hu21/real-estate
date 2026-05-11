import { Form, NavLink, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { signInSuccess, requestStart, requestFailure } from "../store/user/userSlice";
import useAuth from "../hooks/useAuth";
import QAuth from "../components/QAuth";
import useProfileForm from "../hooks/useProfileForm";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import BlocksShuffle2 from "../assets/svgs/blocks-shuffle-2";

function SignIn() {
  const { loading, error } = useSelector((state) => state.user);
  const { handleAuth } = useAuth();
  const { formData, handleChange } = useProfileForm();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const formData = Object.fromEntries(data);
    handleAuth(
      "/api/auth/signin",
      formData,
      requestStart,
      signInSuccess,
      requestFailure,
      "/"
    );
  };

  const excludeKeywords = ["username", "email"];

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left: Decorative Image Side */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-2a4d9fbd40d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/90 to-slate-900/90"></div>
        <div className="relative z-10 text-center px-12">
          <h2 className="text-4xl font-bold text-white mb-6 font-display">Welcome Back</h2>
          <p className="text-sky-100 text-lg leading-relaxed max-w-md mx-auto">
            Access your dashboard to manage listings, check favorites, and connect with potential buyers.
          </p>
        </div>
      </div>

      {/* Right: Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Key<span className="text-sky-600">Haven</span>
            </h1>
            <p className="text-slate-500">Sign in to your account</p>
          </div>

          <Form method="POST" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
              <div className="relative flex items-center">
                <HiOutlineMail className="absolute left-4 text-slate-400 text-xl" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <NavLink to="/forgot" className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline">
                  Forgot Password?
                </NavLink>
              </div>
              <div className="relative flex items-center">
                <HiOutlineLockClosed className="absolute left-4 text-slate-400 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-sky-600 transition-colors outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {!excludeKeywords.some((keyword) => error?.toLowerCase().includes(keyword)) && error?.trim().length > 0 && (
              <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl text-center font-medium border border-rose-100">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <BlocksShuffle2 className="w-5 h-5" /> : "Sign In"}
            </button>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>

          <QAuth />

          <p className="mt-8 text-center text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link to="/sign-up" className="font-bold text-sky-600 hover:text-sky-700 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;