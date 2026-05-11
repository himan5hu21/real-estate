import { MdOutlineQuestionAnswer } from "react-icons/md";
import { BiSelectMultiple } from "react-icons/bi";
import { GrCertificate } from "react-icons/gr";
import { HiOutlineArrowRight } from "react-icons/hi";

function Features() {
  const features = [
    {
      icon: <MdOutlineQuestionAnswer className="text-2xl" />,
      step: "01",
      title: "Get Expert Consultation",
      description: "Connect with experienced professionals who understand your unique needs and guide you through every step.",
      color: "sky",
      gradient: "from-sky-500 to-cyan-400",
      lightBg: "bg-sky-50",
      hoverBg: "group-hover:bg-sky-500"
    },
    {
      icon: <BiSelectMultiple className="text-2xl" />,
      step: "02", 
      title: "Browse Premium Properties",
      description: "Explore curated collections with detailed information, high-quality photos, and virtual tours.",
      color: "emerald",
      gradient: "from-emerald-500 to-teal-400",
      lightBg: "bg-emerald-50",
      hoverBg: "group-hover:bg-emerald-500"
    },
    {
      icon: <GrCertificate className="text-2xl" />,
      step: "03",
      title: "Secure Your Dream Home",
      description: "Complete your transaction with confidence through our transparent process and dedicated support.",
      color: "amber",
      gradient: "from-amber-500 to-orange-400",
      lightBg: "bg-amber-50",
      hoverBg: "group-hover:bg-amber-500"
    }
  ];

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-slate-50 to-transparent rounded-full blur-3xl opacity-70" />
      
      {/* Decorative Line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent hidden lg:block" />

      <div className="relative container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-sky-50 rounded-full px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 bg-sky-500 rounded-full" />
            <span className="text-sm font-medium text-sky-700">Simple Steps to Success</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Your Journey to the{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
                Perfect Property
              </span>
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            We've simplified the home-finding process into three easy steps, 
            so you can focus on what matters most — finding your perfect space.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative"
            >
              {/* Connection Line for Desktop */}
              {index < 2 && (
                <div className="absolute top-16 left-full w-full h-px bg-gradient-to-r from-slate-200 to-transparent hidden lg:block z-0" />
              )}

              <div className="relative bg-white rounded-3xl p-8 lg:p-10 border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                {/* Step Number Background */}
                <div className="absolute -top-4 -right-4 text-[120px] font-bold text-slate-50 leading-none select-none group-hover:text-slate-100/80 transition-colors duration-500">
                  {feature.step}
                </div>

                {/* Icon */}
                <div className={`relative w-16 h-16 ${feature.lightBg} rounded-2xl flex items-center justify-center mb-6 ${feature.hoverBg} transition-colors duration-300`}>
                  <div className={`text-${feature.color}-600 group-hover:text-white transition-colors duration-300`}>
                    {feature.icon}
                  </div>
                </div>

                {/* Step Badge */}
                <div className={`inline-flex items-center gap-1 bg-gradient-to-r ${feature.gradient} text-white text-xs font-semibold px-3 py-1 rounded-full mb-4`}>
                  Step {feature.step}
                </div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-sky-600 transition-colors duration-300 cursor-pointer">
                  <span className="text-sm font-medium">Learn more</span>
                  <HiOutlineArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                {/* Hover Gradient Border Effect */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}>
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-5`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl px-8 py-5 shadow-xl shadow-slate-900/20">
            <div className="text-left">
              <p className="text-slate-400 text-sm">Ready to start?</p>
              <p className="text-white font-semibold">Begin your journey today</p>
            </div>
            <a 
              href="/properties" 
              className="flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-sky-50 transition-colors"
            >
              Get Started
              <HiOutlineArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;