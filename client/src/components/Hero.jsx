import circle from "../assets/images/circle.png";
import person1 from "../assets/images/person-1.jpg";
import person2 from "../assets/images/person-2.jpg";
import sideimage from "../assets/images/sideimage5.png";
import sideimage2 from "../assets/images/sideimage3.jpg";
import sideimage1 from "../assets/images/sideimage1.jpg";
import { IoMdAdd, IoMdList } from "react-icons/io";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="mx-5 p-5 pt-10">
      <div className="flex flex-col xl:flex-row gap-10 xl:gap-16">
        {/* left */}
        <div className="flex justify-center flex-1 flex-col gap-y-6 xl:gap-y-8 xl:max-w-[555px] relative">
          <h1 className="text-3xl xl:text-4xl font-extrabold">
            Find Your <span className="text-sky-600">Dream Home</span> with
            KeyHaven
          </h1>
          <p className="text-sm xl:text-base leading-relaxed">
            Discover exceptional properties across India with our expert guidance. Whether you're buying your first home, investing in property, or looking for the perfect rental, we make the process simple, transparent, and successful.
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="text-center">
              <div className="text-2xl xl:text-3xl font-bold text-sky-600">10K+</div>
              <div className="text-sm text-gray-600">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl xl:text-3xl font-bold text-sky-600">5K+</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl xl:text-3xl font-bold text-sky-600">15+</div>
              <div className="text-sm text-gray-600">Cities Covered</div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/properties"
              className="flex items-center bg-slate-800 text-white py-3 px-6 rounded-full text-sm xl:text-base hover:shadow-lg transition-all duration-300 hover:bg-slate-700"
            >
              <IoMdList className="text-xl xl:text-2xl mr-2" />
              Explore Properties
            </Link>
            <Link
              to="/addProperty"
              className="flex items-center bg-sky-600 text-white py-3 px-6 rounded-full text-sm xl:text-base hover:shadow-lg hover:shadow-sky-200 transition-all duration-300 hover:bg-sky-700"
            >
              <IoMdAdd className="text-xl xl:text-2xl mr-2" />
              Add Property
            </Link>
          </div>
          <div className="flex relative">
            {/* Client Images */}
            <img
              src={circle}
              alt="Happy Clients"
              className="rounded-full h-[60px] xl:h-[99px] z-30"
            />
            <img
              src={person1}
              alt="Happy Client 1"
              className="rounded-full h-[60px] xl:h-[99px] shadow-sm absolute left-12 xl:left-16 z-20"
            />
            <img
              src={person2}
              alt="Happy Client 2"
              className="rounded-full h-[60px] xl:h-[99px] shadow-sm absolute left-24 xl:left-32 z-10"
            />
          </div>
        </div>
        {/* right */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="rounded-2xl h-[180px] sm:h-auto md:h-[366px] xl:h-[266px] overflow-hidden">
            <img
              src={sideimage}
              alt="Beautiful property interior"
              className="rounded-xl object-cover w-full h-full"
            />
          </div>
          <div className="flex justify-between gap-4 xl:h-[266px]">
            <div className="flex flex-1 rounded-xl">
              <img
                src={sideimage1}
                alt="Modern kitchen"
                className="rounded-xl aspect-square object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-1 rounded-xl">
              <img
                src={sideimage2}
                alt="Cozy living room"
                className="rounded-xl aspect-square object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
