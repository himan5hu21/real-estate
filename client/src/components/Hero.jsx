import { IoMdAdd, IoMdList } from "react-icons/io";
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import circle from "../assets/images/circle.png";
import person1 from "../assets/images/person-1.jpg";
import person2 from "../assets/images/person-2.jpg";
import sideimage from "../assets/images/sideimage5.png";
import sideimage2 from "../assets/images/sideimage3.jpg";
import sideimage1 from "../assets/images/sideimage1.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br -mt-2 from-slate-50 via-white to-sky-50">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-sky-100/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-amber-100/30 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative container mx-auto px-6 lg:px-12 pt-8 pb-16 lg:pt-8 lg:pb-16">
        <div className="flex flex-col xl:flex-row gap-12 xl:gap-20 items-center">
          {/* Left Content */}
          <div className="flex-1 flex flex-col gap-y-8 xl:max-w-[600px] z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-sky-100 rounded-full px-4 py-2 w-fit shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-600">
                Trusted by 5,000+ Happy Homeowners
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight">
                <span className="text-slate-900">Find Your</span>
                <br />
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                    Dream Home
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 8.5C50 2.5 150 2.5 298 8.5" stroke="url(#underline-gradient)" strokeWidth="4" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="underline-gradient" x1="0" y1="0" x2="300" y2="0">
                        <stop stopColor="#0284c7" stopOpacity="0.3"/>
                        <stop offset="0.5" stopColor="#0ea5e9" stopOpacity="0.6"/>
                        <stop offset="1" stopColor="#06b6d4" stopOpacity="0.3"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <br />
                <span className="text-slate-900">with KeyHaven</span>
              </h1>
              
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Discover exceptional properties across India with our expert guidance. 
                Whether buying, investing, or renting — we make every step 
                <span className="text-sky-600 font-medium"> simple</span>, 
                <span className="text-sky-600 font-medium"> transparent</span>, and 
                <span className="text-sky-600 font-medium"> successful</span>.
              </p>
            </div>

            {/* Statistics */}
            <div className="flex gap-8 py-6 border-y border-slate-200/60">
              {[
                { value: "10K+", label: "Properties", sublabel: "Listed" },
                { value: "5K+", label: "Happy", sublabel: "Clients" },
                { value: "15+", label: "Cities", sublabel: "Covered" },
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="text-3xl xl:text-4xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-sky-600 group-hover:to-cyan-600 transition-all duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 leading-tight mt-1">
                    {stat.label}<br/>{stat.sublabel}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/properties"
                className="group flex items-center gap-3 bg-slate-900 text-white py-4 px-8 rounded-2xl text-base font-semibold hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-0.5"
              >
                <IoMdList className="text-xl" />
                Explore Properties
                <HiOutlineArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/addProperty"
                className="group flex items-center gap-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-4 px-8 rounded-2xl text-base font-semibold hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5"
              >
                <IoMdAdd className="text-xl" />
                List Your Property
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                <img src={circle} alt="Client" className="w-12 h-12 rounded-full ring-4 ring-white shadow-md" />
                <img src={person1} alt="Client" className="w-12 h-12 rounded-full ring-4 ring-white shadow-md" />
                <img src={person2} alt="Client" className="w-12 h-12 rounded-full ring-4 ring-white shadow-md" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 ring-4 ring-white shadow-md flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2K+</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-slate-500">4.9/5 from 2,000+ reviews</span>
              </div>
            </div>
          </div>

          {/* Right - Image Grid */}
          <div className="flex-1 w-full max-w-[600px] xl:max-w-none">
            <div className="relative">
              {/* Floating Card */}
              {/* <div className="absolute -left-6 top-1/4 z-20 bg-white rounded-2xl p-4 shadow-2xl shadow-slate-200/50 border border-slate-100 hidden lg:block animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Verified Property</p>
                    <p className="text-sm text-slate-500">100% Authentic Listings</p>
                  </div>
                </div>
              </div> */}

              {/* Main Image */}
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-white/50">
                <img
                  src={sideimage}
                  alt="Beautiful property"
                  className="w-full h-[280px] lg:h-[350px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Secondary Images */}
              <div className="flex gap-4 mt-4">
                <div className="flex-1 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 border border-white/50 group">
                  <img
                    src={sideimage1}
                    alt="Modern kitchen"
                    className="w-full h-[140px] lg:h-[180px] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="flex-1 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 border border-white/50 group relative">
                  <img
                    src={sideimage2}
                    alt="Cozy living room"
                    className="w-full h-[140px] lg:h-[180px] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay Badge */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 hidden sm:block">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Starting from</p>
                        <p className="font-bold text-slate-900">₹45 Lakhs</p>
                      </div>
                      <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                        <HiOutlineArrowRight className="text-white text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats Card */}
              {/* <div className="absolute -right-4 bottom-1/4 z-20 bg-white rounded-2xl p-4 shadow-2xl shadow-slate-200/50 border border-slate-100 hidden lg:block animate-float-delayed">
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">98%</p>
                  <p className="text-sm text-slate-500">Success Rate</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 0.5s;
        }
      `}</style>
    </section>
  );
};

export default Hero;