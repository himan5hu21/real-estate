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
            Invest in <span className="text-sky-600">Your Future</span> with
            confidence
          </h1>
          <p className="text-sm xl:text-base leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            quo dolore, dolores ut obcaecati quis voluptate! Repellat debitis
            excepturi, accusantium amet distinctio animi qui maxime ex, dicta
            molestias voluptates dolores, labore tenetur temporibus sapiente
            repellendus est soluta voluptatum? Provident omnis quibusdam
            molestiae amet adipisci ratione perspiciatis repudiandae architecto
            minima! Possimus est voluptates unde repellat aperiam?
          </p>
          <div className="flex gap-3">
            <Link
              to="/Properties"
              className="flex items-center bg-slate-800 text-white py-2 px-4 rounded-full text-sm xl:text-base hover:shadow-lg transition-shadow duration-300"
            >
              <IoMdList className="text-xl xl:text-2xl pr-1" />
              Explore Properties
            </Link>
            <Link
              to="/addProperty"
              className="flex items-center bg-sky-600 text-white py-2 px-4 rounded-full text-sm xl:text-base hover:shadow-lg hover:shadow-gray-300 transition-shadow duration-300"
            >
              <IoMdAdd className="text-xl xl:text-2xl pr-1" />
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
              alt="person 1"
              className="rounded-full h-[60px] xl:h-[99px] shadow-sm absolute left-12 xl:left-16 z-20"
            />
            <img
              src={person2}
              alt="person 2"
              className="rounded-full h-[60px] xl:h-[99px] shadow-sm absolute left-24 xl:left-32 z-10"
            />
          </div>
        </div>
        {/* right */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="rounded-2xl h-[180px] sm:h-auto md:h-[366px] xl:h-[266px] overflow-hidden">
            <img
              src={sideimage}
              alt="sideimage"
              className="rounded-xl object-cover w-full h-full"
            />
          </div>
          <div className="flex justify-between gap-4 xl:h-[266px]">
            <div className="flex flex-1 rounded-xl">
              <img
                src={sideimage1}
                alt="sideimage"
                className="rounded-xl aspect-square object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-1 rounded-xl">
              <img
                src={sideimage2}
                alt="sideimage"
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
