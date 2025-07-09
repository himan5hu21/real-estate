import {
  BsEnvelopeFill,
  BsFacebook,
  BsGeoAltFill,
  BsInstagram,
  BsLinkedin,
  BsTelephoneFill,
  BsTwitterX,
} from "react-icons/bs";

function Footer() {
  return (
    <footer className="mx-5 my-10">
      <div className="mx-5 p-10 bg-black text-white py-10 rounded-3xl">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo */}
          <a href="/">
            <div className="text-2xl font-bold">
              <span className="text-sky-600">Key</span>Haven
            </div>
            <p className="text-white/70">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Laudantium et, atque saepe error laboriosam consequuntur?
            </p>
            <p className="mt-4 text-white/70">
              &#169; 2024 KeyHaven. All rights reserved.
            </p>
          </a>
          {/* Quick Links */}
          <div className="">
            <h4 className="text-lg mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-base">
              <li className="text-gray-100">
                <a href="/about">About Us</a>
              </li>
              <li className="text-gray-100">
                <a href="/properties">Properties</a>
              </li>
              <li className="text-gray-100">
                <a href="/services">Services</a>
              </li>
              <li className="text-gray-100">
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact Info*/}
          <div>
            <h4 className="text-lg mb-4 font-semibold">Contact Us</h4>
            <p className="text-gray-100 mb-2">
              <BsTelephoneFill className="inline-block mr-2" /> +1 (123)
              456-7890
            </p>
            <p className="text-gray-100 mb-2">
              <BsEnvelopeFill className="inline-block mr-2" />{" "}
              support@keyhaven.com
            </p>
            <p className="text-gray-100 mb-2">
              <BsGeoAltFill className="inline-block mr-2" /> 123 Real Estate
              Avenue, Suite 100, New York, NY, USA
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg mb-4 font-semibold">Follow Us</h4>
            <div className="flex space-x-4 text-gray-100">
              <a href="#" className="hover:text-blue-500">
                <BsFacebook />
              </a>
              <a href="#" className="hover:text-blue-400">
                <BsTwitterX />
              </a>
              <a href="#" className="hover:text-red-500">
                <BsInstagram />
              </a>
              <a href="#" className="hover:text-blue-600">
                <BsLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-gray-100">
          <p>
            Powered by{" "}
            <a href="#" className="text-sky-600 font-semibold">
              KeyHaven Team
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
