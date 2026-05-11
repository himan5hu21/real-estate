import { BsCheck2Circle } from "react-icons/bs";
import { HiOutlineArrowRight } from "react-icons/hi";
import aboutImg from "../assets/images/aboutImage1.jpg";

function About() {
  const benefits = [
    { text: "Access exclusive property listings", highlight: "exclusive" },
    { text: "Expert advice from local professionals", highlight: "Expert" },
    { text: "Find your dream home in prime locations", highlight: "prime locations" },
    { text: "Seamless online property search experience", highlight: "Seamless" },
    { text: "Get personalized property recommendations", highlight: "personalized" },
    { text: "Transparent and hassle-free transactions", highlight: "Transparent" },
    { text: "24/7 customer support for all inquiries", highlight: "24/7" },
    { text: "Comprehensive market analysis and reports", highlight: "Comprehensive" },
  ];

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-sky-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative container mx-auto px-6 lg:px-12">
        <div className="flex flex-col xl:flex-row items-center gap-16 xl:gap-24">
          {/* Left - Image Section */}
          <div className="flex-1 w-full max-w-xl xl:max-w-none">
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50">
                <img
                  src={aboutImg}
                  alt="Beautiful modern home"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                
                {/* Floating Content on Image */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Years of Excellence</p>
                        <p className="text-3xl font-bold text-slate-900">10+</p>
                      </div>
                      <div className="w-px h-12 bg-slate-200" />
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Properties Sold</p>
                        <p className="text-3xl font-bold text-slate-900">5K+</p>
                      </div>
                      <div className="w-px h-12 bg-slate-200" />
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Happy Clients</p>
                        <p className="text-3xl font-bold text-slate-900">98%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl -z-10" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl -z-10 opacity-60" />

              {/* Floating Badge */}
              <div className="absolute -right-4 top-1/4 bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Trusted</p>
                    <p className="text-sm text-slate-500">& Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content Section */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 bg-sky-50 rounded-full px-4 py-2 mb-6">
                <span className="w-1.5 h-1.5 bg-sky-500 rounded-full" />
                <span className="text-sm font-medium text-sky-700">Few Steps to Your New Home</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                This is How{" "}
                <span className="bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
                  Easy
                </span>{" "}
                It Can Be
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We've streamlined the entire property journey to make finding 
                your perfect home as simple as possible.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="group flex items-start gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform duration-300">
                    <BsCheck2Circle className="text-white text-sm" />
                  </div>
                  <span className="text-slate-700 leading-relaxed pt-1">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="/properties"
                className="group inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-300"
              >
                Start Exploring
                <HiOutlineArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="/contact"
                className="inline-flex items-center gap-2 text-slate-700 font-semibold hover:text-sky-600 transition-colors"
              >
                <span className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                Talk to an Expert
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;