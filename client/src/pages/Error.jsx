import { useRouteError, Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle, HiOutlineHome, HiArrowLeft } from "react-icons/hi";

export default function Error() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-sky-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-rose-100/40 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      {/* Main Card */}
      <div className="max-w-lg w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12 text-center relative z-10">
        
        {/* Icon */}
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <HiOutlineExclamationCircle className="w-12 h-12 text-rose-500" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 font-display tracking-tight">
          Oops!
        </h1>
        <p className="text-lg text-slate-500 mb-8 leading-relaxed">
          Sorry, an unexpected error has occurred while processing your request.
        </p>

        {/* Technical Error Details */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-10">
          <p className="text-sm font-mono text-rose-600 break-words">
            {error.statusText || error.message || "Unknown Error"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
          >
            <HiArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-bold hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all duration-200"
          >
            <HiOutlineHome className="w-5 h-5" />
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}