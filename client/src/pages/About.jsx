import React from 'react';
import Footer from '../components/Footer';
import { 
  HiOutlineOfficeBuilding, 
  HiOutlineUserGroup, 
  HiOutlineLightBulb, 
  HiOutlineTrendingUp,
  HiOutlineShieldCheck,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineSparkles,
  HiOutlineHome
} from "react-icons/hi";

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. HERO SECTION */}
      <div className="relative bg-gradient-to-r from-sky-600 to-cyan-600 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sky-50 text-sm font-medium mb-6 border border-white/20">
            <HiOutlineSparkles className="w-4 h-4" />
            <span>Redefining Real Estate</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display leading-tight">
            We Help You Find <br/>
            <span className="text-sky-200">The Perfect Place</span>
          </h1>
          <p className="text-xl text-sky-50 max-w-2xl mx-auto leading-relaxed">
            Your trusted partner in the real estate journey. We combine market expertise with modern technology to make buying, selling, and renting seamless.
          </p>
        </div>
      </div>

      {/* 2. MISSION & VISION */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 mb-6">
                <HiOutlineLightBulb className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-slate-500 leading-relaxed text-lg">
                To empower people to make smarter property decisions. We strive to provide exceptional service that exceeds expectations, making the complex process of real estate transparent and stress-free.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                <HiOutlineTrendingUp className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
              <p className="text-slate-500 leading-relaxed text-lg">
                To be the most trusted and innovative real estate agency globally, known for integrity and unparalleled customer service in every community we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Comprehensive real estate solutions tailored to your unique needs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Property Sales",
                desc: "Expert guidance in buying and selling residential and commercial properties with competitive analysis.",
                icon: HiOutlineHome,
                color: "text-sky-600",
                bg: "bg-sky-50"
              },
              {
                title: "Property Management",
                desc: "Full-service management including tenant screening, rent collection, and maintenance coordination.",
                icon: HiOutlineOfficeBuilding,
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              },
              {
                title: "Strategic Consulting",
                desc: "Professional advice for investment analysis, market trends, and portfolio growth strategies.",
                icon: HiOutlineUserGroup,
                color: "text-purple-600",
                bg: "bg-purple-50"
              }
            ].map((service, index) => (
              <div key={index} className="group p-8 rounded-3xl border border-slate-100 hover:border-sky-100 hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-300 bg-slate-50/50 hover:bg-white">
                <div className={`w-14 h-14 ${service.bg} rounded-2xl flex items-center justify-center ${service.color} mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STATS SECTION */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose KeyHaven?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Numbers that speak for our dedication and success.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Years Experience", value: "10+", icon: HiOutlineShieldCheck },
              { label: "Properties Sold", value: "500+", icon: HiOutlineHome },
              { label: "Happy Clients", value: "2k+", icon: HiOutlineUserGroup },
              { label: "Client Satisfaction", value: "99%", icon: HiOutlineSparkles },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-sky-500/20">
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TEAM SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-16">Meet The Experts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Himanshu Devaiya", role: "Founder & CEO", desc: "Visionary leader with 15+ years driving innovation in real estate.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" },
              { name: "Sarah Johnson", role: "Head of Sales", desc: "Luxury property specialist committed to finding your perfect match.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
              { name: "Michael Chen", role: "Property Manager", desc: "Ensuring seamless operations and tenant satisfaction every day.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80" }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 group hover:-translate-y-2 transition-transform duration-300">
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-sky-600 font-medium mb-4 text-sm uppercase tracking-wide">{member.role}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {member.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-100 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to Start Your Journey?</h2>
            <p className="text-slate-500 text-lg mb-12 max-w-2xl mx-auto">
              Whether you're buying, selling, or renting, our team is here to help you every step of the way.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center text-sky-600 flex-shrink-0">
                  <HiOutlineMail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Us</h4>
                  <p className="text-slate-500 text-sm mt-1">support@keyhaven.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <HiOutlinePhone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Call Us</h4>
                  <p className="text-slate-500 text-sm mt-1">+91 9876543210</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                  <HiOutlineLocationMarker className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Visit Us</h4>
                  <p className="text-slate-500 text-sm mt-1">123 Real Estate Ave, Dream City</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;