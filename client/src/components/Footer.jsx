import {
  BsEnvelopeFill,
  BsFacebook,
  BsGeoAltFill,
  BsInstagram,
  BsLinkedin,
  BsTelephoneFill,
  BsTwitterX,
  BsArrowUpRight,
  BsSend,
} from "react-icons/bs";

function Footer() {
  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Properties", href: "/properties" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  const propertyTypes = [
    { label: "Apartments", href: "/properties?type=apartment" },
    { label: "Villas", href: "/properties?type=villa" },
    { label: "Commercial", href: "/properties?type=commercial" },
    { label: "Land", href: "/properties?type=land" },
  ];

  const socialLinks = [
    { icon: <BsFacebook />, href: "#", label: "Facebook", hoverColor: "hover:bg-blue-600" },
    { icon: <BsTwitterX />, href: "#", label: "Twitter", hoverColor: "hover:bg-slate-700" },
    { icon: <BsInstagram />, href: "#", label: "Instagram", hoverColor: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500" },
    { icon: <BsLinkedin />, href: "#", label: "LinkedIn", hoverColor: "hover:bg-blue-700" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-sky-600 to-cyan-600 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        
        <div className="relative container mx-auto px-6 lg:px-12 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Stay Updated with Latest Properties
              </h3>
              <p className="text-sky-100 text-lg">
                Subscribe to our newsletter and never miss a perfect listing.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-sky-200 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                />
              </div>
              <button className="flex items-center justify-center gap-2 bg-white text-sky-600 px-8 py-4 rounded-2xl font-semibold hover:bg-sky-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Subscribe
                <BsSend className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-slate-900 relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative container mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <a href="/" className="inline-block mb-6">
                <div className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">Key</span>
                  <span className="text-white">Haven</span>
                </div>
              </a>
              <p className="text-slate-400 leading-relaxed mb-6">
                Your trusted partner in finding the perfect property. We make home buying, 
                selling, and renting simple and transparent.
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white ${social.hoverColor} hover:border-transparent transition-all duration-300`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full" />
                Quick Links
              </h4>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <BsArrowUpRight className="text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Property Types */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full" />
                Property Types
              </h4>
              <ul className="space-y-4">
                {propertyTypes.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <BsArrowUpRight className="text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-full" />
                Contact Us
              </h4>
              <ul className="space-y-4">
                <li>
                  <a 
                    href="tel:+919876543210" 
                    className="flex items-start gap-4 text-slate-400 hover:text-white transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500/20 group-hover:border-sky-500/30 transition-colors">
                      <BsTelephoneFill className="text-sky-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Call us</p>
                      <p className="font-medium">+91 9876543210</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:support@keyhaven.com" 
                    className="flex items-start gap-4 text-slate-400 hover:text-white transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500/20 group-hover:border-sky-500/30 transition-colors">
                      <BsEnvelopeFill className="text-sky-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Email us</p>
                      <p className="font-medium">support@keyhaven.com</p>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-4 text-slate-400">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <BsGeoAltFill className="text-sky-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Visit us</p>
                      <p className="font-medium leading-relaxed">123 Real Estate Avenue, Suite 100, New York, NY</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-6 lg:px-12 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-slate-500 text-sm">
                © 2024 <span className="text-sky-400">KeyHaven</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                <a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;