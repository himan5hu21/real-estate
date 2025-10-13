import { MdOutlineQuestionAnswer } from "react-icons/md";
import { BiSelectMultiple } from "react-icons/bi";
import { GrCertificate } from "react-icons/gr";

function Features() {
  return (
    <section className="mx-10 py-12">
      {/* Title */}
      <div className="text-center pb-16">
        <h6 className="capitalize text-sky-600 font-medium mb-2">Simple Steps to Success</h6>
        <h2 className="text-3xl font-bold capitalize">
          Your Journey to the Perfect Property
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <MdOutlineQuestionAnswer className="text-4xl mb-4 text-sky-600" />
          <h4 className="text-xl font-semibold mb-3">Get Expert Consultation</h4>
          <p className="text-gray-600 leading-relaxed">
            Connect with our experienced real estate professionals who understand your unique needs and guide you through every step of your property journey.
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <BiSelectMultiple className="text-4xl mb-4 text-emerald-600" />
          <h4 className="text-xl font-semibold mb-3">Browse Premium Properties</h4>
          <p className="text-gray-600 leading-relaxed">
            Explore our curated collection of verified properties with detailed information, high-quality photos, and virtual tours to help you make informed decisions.
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <GrCertificate className="text-4xl mb-4 text-amber-600" />
          <h4 className="text-xl font-semibold mb-3">Secure Your Dream Home</h4>
          <p className="text-gray-600 leading-relaxed">
            Complete your property transaction with confidence through our transparent process, legal assistance, and dedicated support until you get the keys.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Features;
