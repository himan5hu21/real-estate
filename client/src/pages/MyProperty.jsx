import axios from "axios";
import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { useSelector } from "react-redux";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

function MyProperty() {
  const userId = useSelector((state) => state.user.currentUser._id);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get(`/api/user/listings/${userId}`);
        setProperties(res.data.listings);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/listing/delete/${id}`);
      const data = await res.data;

      if (!data.success) {
        console.error("Error deleting property:", data.message);
        return;
      }

      setProperties((prevProperties) =>
        prevProperties.filter((p) => p._id !== id)
      );
    } catch (error) {
      console.error(
        "Error deleting property:",
        error.response?.data?.message || error.message
      );
    }
  };

  if (!properties || properties.length === 0) {
    return <p>No properties found for this user.</p>;
  }

  return (
    <section className="mx-10 py-12">
      <div className="grid px-5 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 justify-items-start">
        {properties.map((property) => (
          <div key={property._id} className="relative">
            <PropertyCard property={property} />
            <div className="absolute top-2 right-2 flex justify-between gap-2 items-center text-sky-600 ">
              <button className="rounded-full bg-slate-100 p-2">
                <FaRegEdit />
              </button>
              <button
                className="rounded-full bg-slate-100 p-2"
                onClick={() => handleDelete(property._id)}
              >
                <MdDeleteOutline />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MyProperty;
