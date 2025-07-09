import { useEffect, useMemo, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import axios from "axios";

const Properties = () => {
  const [isRenting, setIsRenting] = useState(false);
  // const [filteredProperties, setFilteredProperties] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("/api/listing/list");
        setProperties(res.data.properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  // const properties = useMemo(
  //   () => [
  //     {
  //       id: 1,
  //       title: "Luxury Apartment",
  //       location: "New York, NY",
  //       price: "$1,200,000",
  //       imageUrl: "https://example.com/property1.jpg",
  //       type: "buy",
  //       bedrooms: 3,
  //       bathrooms: 2,
  //     },
  //     {
  //       id: 2,
  //       title: "Cozy Cottage",
  //       location: "Lake Tahoe, CA",
  //       price: "$750,000",
  //       imageUrl: "https://example.com/property2.jpg",
  //       type: "buy",
  //       bedrooms: 2,
  //       bathrooms: 1,
  //     },
  //     {
  //       id: 3,
  //       title: "Modern Villa",
  //       location: "Miami, FL",
  //       price: "$2,000,000",
  //       imageUrl: "https://example.com/property3.jpg",
  //       type: "buy",
  //       bedrooms: 4,
  //       bathrooms: 3,
  //     },
  //     {
  //       id: 4,
  //       title: "Charming Apartment",
  //       location: "Los Angeles, CA",
  //       price: "$2,500/month",
  //       imageUrl: "https://example.com/rent1.jpg",
  //       type: "buy",
  //       bedrooms: 1,
  //       bathrooms: 1,
  //     },
  //     {
  //       id: 5,
  //       title: "Beach House",
  //       location: "San Diego, CA",
  //       price: "$3,000/month",
  //       imageUrl: "https://example.com/rent2.jpg",
  //       type: "rent",
  //       bedrooms: 2,
  //       bathrooms: 2,
  //     },
  //     {
  //       id: 6,
  //       title: "Beach House",
  //       location: "San Diego, CA",
  //       price: "$3,000/month",
  //       imageUrl: "https://example.com/rent2.jpg",
  //       type: "buy",
  //       bedrooms: 2,
  //       bathrooms: 2,
  //     },
  //     {
  //       id: 7,
  //       title: "Beach House",
  //       location: "San Diego, CA",
  //       price: "$3,000/month",
  //       imageUrl: "https://example.com/rent2.jpg",
  //       type: "rent",
  //       bedrooms: 2,
  //       bathrooms: 2,
  //     },
  //     {
  //       id: 8,
  //       title: "Beach House",
  //       location: "San Diego, CA",
  //       price: "$3,000/month",
  //       imageUrl: "https://example.com/rent2.jpg",
  //       type: "rent",
  //       bedrooms: 2,
  //       bathrooms: 2,
  //     },
  //   ],
  //   []
  // );

  // useEffect(() => {
  //   const updatedProperties = properties.filter((property) =>
  //     isRenting ? property.type === "rent" : property.type === "buy"
  //   );
  //   setFilteredProperties(updatedProperties);
  // }, [isRenting, properties]);

  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    return properties.filter((property) =>
      isRenting ? property.type === "rent" : property.type === "buy"
    );
  }, [isRenting, properties]);

  return (
    <div className="container mx-auto p-5">
      {/* Header Section */}
      <header className="mb-5 text-center">
        <h1 className="text-3xl font-bold">Find Your Dream Home</h1>
        <p className="text-gray-600">
          Browse through our listings of buy and rent properties
        </p>
      </header>

      {/* Filter Section */}
      <div className="flex justify-center mb-5">
        <button
          onClick={() => setIsRenting(false)}
          className={`px-4 py-2 rounded-md ${
            !isRenting ? "bg-sky-700 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Buy Properties
        </button>
        <button
          onClick={() => setIsRenting(true)}
          className={`ml-4 px-4 py-2 rounded-md ${
            isRenting ? "bg-sky-700 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Rent Properties
        </button>
      </div>

      {/* Search Section */}
      <div className="flex items-center gap-5 mb-5 px-5">
        <input
          type="text"
          placeholder="Search properties..."
          className="w-full md:w-1/2 p-2 border rounded-md"
        />
        <button className=" bg-sky-700 text-white px-4 py-2 rounded-md">
          Search
        </button>
      </div>

      {/* Properties Grid Section */}
      <div className="grid px-5 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 justify-items-start">
        {filteredProperties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
        {console.log(properties[1])}
      </div>
    </div>
  );
};

export default Properties;
