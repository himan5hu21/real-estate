import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { categories, facilities, types } from "../assets/resources/data";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { BiTrash } from "react-icons/bi";
import { IoIosImages } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa";
import BlocksShuffle2 from "../assets/svgs/blocks-shuffle-2";
import classNames from "classnames";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase/firebaseConfig";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "../assets/css/pages.css";

// Utility functions for number formatting
const formatNumber = (value) => {
  if (!value || value === "") return "";
  const num = parseInt(value.toString().replace(/,/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString('en-IN');
};

const parseNumber = (value) => {
  if (!value || value === "") return "";
  return value.toString().replace(/,/g, "");
};

// Enhanced number input component with better editing support
const FormattedNumberInput = ({
  value,
  onChange,
  onBlur,
  placeholder,
  label,
  className = ""
}) => {
  const [displayValue, setDisplayValue] = useState(formatNumber(value));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Always show formatted value, but track if user is actively editing
    setDisplayValue(formatNumber(value));
  }, [value]);

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onBlur && onBlur();
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    // Allow only numbers and commas for formatted input
    const cleanedValue = inputValue.replace(/[^\d,]/g, '');

    // Parse the cleaned value to get the actual number
    const parsedValue = parseNumber(cleanedValue);

    // Update display to show what user types (with formatting)
    setDisplayValue(formatNumber(parsedValue) || cleanedValue);

    // Update parent state with parsed number
    onChange(parsedValue);
  };

  return (
    <div>
      {label && (
        <label className="block text-gray-700 font-medium pb-1">
          {label}
        </label>
      )}
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`outline-none border-none ring-1 mb-2 p-2 ${className} rounded-md shadow-sm focus:ring-sky-600`}
      />
    </div>
  );
};

const EditProperty = () => {
  const { id } = useParams();
  console.log(id);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const userId = useSelector((state) => state.user.currentUser._id);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [photos, setPhotos] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [error, setError] = useState("");

  const [categoryError, setCategoryError] = useState("");
  const [typePlaceError, setTypePlaceError] = useState("");
  const [photosError, setPhotosError] = useState("");

  const [details, setDetails] = useState({
    guestCount: 1,
    bedroomsCount: 1,
    bedCount: 1,
    bathroomsCount: 1,
  });

  const addressFields = [
    { label: "Street Address", name: "streetAddress", placeholder: "Street" },
    { label: "City", name: "city", placeholder: "City" },
    { label: "State", name: "state", placeholder: "State" },
    { label: "Country", name: "country", placeholder: "Country" },
  ];

  const labels = {
    guestCount: "Guestrooms",
    bedroomsCount: "Bedrooms",
    bedCount: "Beds",
    bathroomsCount: "Bathrooms",
  };

  const radios = ["buy", "rent"];

  const selectedRadioOptions = watch("propertyType");

  useEffect(() => {
    return () => {
      photos.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [photos]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/listing/list/${id}`);
        const property = res.data.listing;

        // Pre-fill state values
        setCategory(property.category);
        setType(property.area);
        setAmenities(property.features);
        console.log(property);
        setDetails({
          guestCount: property.guestrooms,
          bedroomsCount: property.bedrooms,
          bedCount: property.beds,
          bathroomsCount: property.bathrooms,
        });

        // setPhotos with imageUrls mapped to your {id, url} format
        setPhotos(
          property.imageUrls.map((url, index) => ({
            id: `existing-${index}`,
            url,
            file: null, // No file object since these are already uploaded
          }))
        );

        // Reset form values using react-hook-form
        reset({
          name: property.name,
          description: property.description,
          streetAddress: property.address.streetAddress,
          city: property.address.city,
          state: property.address.state,
          country: property.address.country,
          postalCode: property.address.postalCode,
          price: property.price,
          propertyType: property.type,
        });
      } catch (err) {
        console.error("Error fetching property:", err);
      }
    };

    fetchProperty();
  }, [id, reset]);

  const storeImage = async (file, retries = 3) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName =
        "propertyImages/" + userId + "/" + new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          if (retries > 0) {
            console.warn(`Retrying upload... Attempts left: ${retries}`);
            setTimeout(() => {
              resolve(storeImage(file, retries - 1)); // Retry upload
            }, 1000);
          } else {
            console.error("Upload failed after multiple attempts:", error);
            reject(new Error("Failed to upload image. Please try again."));
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSelectAmenities = (facility) => {
    if (amenities.includes(facility)) {
      setAmenities((prevAmenities) =>
        prevAmenities.filter((option) => option !== facility)
      );
    } else {
      setAmenities((prev) => [...prev, facility]);
    }
  };

  const handleUploadPhotos = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => {
      const url = URL.createObjectURL(file);
      return { id: `${file.name}-${Math.random()}`, url, file };
    });
    setPhotos((prev) => [...prev, ...newImages]);
  };

  const handleDragPhoto = (result) => {
    if (!result.destination) return;

    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhotos(items);
  };

  const handleRemovePhoto = (id) => {
    setPhotos((prev) => prev.filter((image) => image.id !== id));
  };

  const handleDetailChange = (key, operation) => {
    setDetails((prev) => ({
      ...prev,
      [key]:
        operation === "increment" ? prev[key] + 1 : Math.max(1, prev[key] - 1),
    }));
  };

  const handlePost = async (data) => {
    // e.preventDefault();
    let hasError = false;

    if (!category) {
      setCategoryError("You must select the category of your property.");
      hasError = true;
    } else {
      setCategoryError("");
    }

    if (!type) {
      setTypePlaceError("You must select the type of your place.");
      hasError = true;
    } else {
      setTypePlaceError("");
    }

    if (!photos || photos.length < 1) {
      setPhotosError("You must upload at least one image");
      hasError = true;
    } else {
      setPhotosError("");
    }

    if (hasError) {
      return;
    }

    setLoading(true);
    setError(false);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const updatedFormData = {
      userRef: userId,
      name: data.name,
      description: data.description,
      address: {
        streetAddress: data.streetAddress,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: parseInt(data.postalCode, 10) || 0,
      },
      price: parseInt(data.price, 10) || 0, // Ensure price is stored as a number
      type: data.propertyType,
      bedrooms: details.bedroomsCount,
      bathrooms: details.bathroomsCount,
      guestrooms: details.guestCount,
      beds: details.bedCount,
      features: amenities,
      area: type,
      category: category,
      imageUrls: [],
    };

    try {
      // Upload images

      // console.log(updatedFormData);

      // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      // Separate existing and new photos
      const existingImageUrls = photos
        .filter((photo) => photo.file === null && photo.url)
        .map((photo) => photo.url);

      const newPhotos = photos.filter((photo) => photo.file !== null);

      const uploadedImageUrls = await Promise.all(
        newPhotos.map(async (photo, index) => {
          await delay(index * 1000); // slight delay
          return await storeImage(photo.file);
        })
      );

      const allImageUrls = [...existingImageUrls, ...uploadedImageUrls];

      // const imageUrls = await Promise.all(
      //   photos.map(async (photo, index) => {
      //     await delay(index * 1000);
      //     return storeImage(photo.file);
      //   })
      // );
      updatedFormData.imageUrls = allImageUrls;

      // console.log(updatedFormData);

      const res = await axios.put(
        `/api/listing/update/${id}`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.data;
      if (!data.success) {
        setError(data.message);
        console.log(data.message);
        return;
      }
      navigate("/", { replace: true });
      setError(false);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="mx-10 py-10">
        <h3 className="text-2xl font-semibold px-2 pb-5">Edit Property</h3>
        <form onSubmit={handleSubmit(handlePost)}>
          <h4 className="text-lg font-medium px-2">
            Describe Your Property?<span className="text-red-500">*</span>
          </h4>
          {/* Categories container */}
          <div className="hide-scrollbar flex gap-x-1 xl:justify-center bg-white ring-1 ring-slate-400/5 shadow-md rounded-full px-2 py-3 my-5">
            {categories
              .filter((item) => item.label !== "All")
              .map((item) => (
                <div
                  key={item.label}
                  onClick={() => {
                    setCategory(item.label);
                    setValue("category", item.label);
                  }}
                  className={classNames(
                    "flex items-center flex-col gap-2 p-2 rounded-xl cursor-pointer min-w-24 xl:min-w-32",
                    {
                      "bg-sky-100":
                        category?.toLowerCase() === item.label.toLowerCase(),
                    }
                  )}
                  style={{ flexShrink: 0 }}
                >
                  <div
                    className="text-sky-600 rounded-full h-10 w-10 p-2 flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${item.color}` }}
                  >
                    {item.icon}
                  </div>
                  <p
                    className={`${
                      category === item.label ? "text-sky-600" : ""
                    } text-base`}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
          </div>
          {/* Error Message */}
          {categoryError && (
            <p className="text-red-500 text-sm px-2">{categoryError}</p>
          )}

          {/* Container Types & Locations */}
          <div className="px-2 flex flex-col lg:flex-row lg:justify-between lg:gap-10">
            <div className="flex flex-1 flex-col xl:flex-row gap-x-16 mt-10">
              <div className="flex-1">
                {/* Types of Places */}
                <h4 className="text-lg font-medium px-2 pb-5">
                  What is the type of your place?
                  <span className="text-red-500">*</span>
                </h4>
                <div className="flex flex-col gap-y-3">
                  {types.map((item) => (
                    <div
                      key={item.name}
                      className={`ring-1 ${
                        type === item.name ? "ring-sky-600" : "ring-slate-900/5"
                      } flex items-center justify-between max-w-[777px] rounded-xl px-4 py-1 `}
                      onClick={() => setType(item.name)}
                    >
                      <div>
                        <h5 className="text-base font-semibold">{item.name}</h5>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>

                      <div className="text-2xl">{item.icon}</div>
                    </div>
                  ))}
                </div>
                {/* Error Message */}
                {typePlaceError && (
                  <p className="text-red-500 text-sm p-2">{typePlaceError}</p>
                )}
              </div>
            </div>

            {/* Place Location */}
            <div className="flex-1 my-5 lg:mt-10">
              <h4 className="text-lg font-medium px-2 py-2">
                What&apos;s the address of your place?
              </h4>
              <div className="px-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addressFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-gray-700 font-medium pb-1">
                      {field.label}:<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      {...register(field.name, {
                        required: `${field.label} is required`,
                      })}
                      className={`outline-none border-none ring-1 mb-2 p-2 ${
                        errors[field.name] ? "ring-red-600" : "ring-gray-300"
                      } rounded-md shadow-sm focus:ring-sky-600`}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">
                        {errors[field.name]?.message}
                      </p>
                    )}
                  </div>
                ))}

                <div>
                  <label className="block text-gray-700 font-medium pb-1">
                    Postal Code:<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your postal code (e.g., 380021)"
                    {...register("postalCode", {
                      required: "Postal code is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Please enter a valid 6-digit postal code",
                      },
                    })}
                    className={`outline-none border-none ring-1 mb-2 p-2 ${
                      errors.postalCode ? "ring-red-600" : "ring-gray-300"
                    } rounded-md shadow-sm focus:ring-sky-600`}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Essential */}
          <h4 className="text-lg font-medium px-2 pb-5">
            Provide some essential details about your place?
          </h4>
          <div className="px-2 flex flex-wrap gap-4 mb-4">
            {Object.entries(details).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-x-4 ring-1 ring-slate-900/5 p-2 rounded"
              >
                <h5>{labels[key]}</h5>
                <div className="flex items-center gap-x-2 bg-white">
                  <FaMinus
                    onClick={() => handleDetailChange(key, "decrement")}
                    className="h-6 w-6 text-xl p-1 rounded cursor-pointer"
                  />
                  <p>{value}</p>
                  <FaPlus
                    onClick={() => handleDetailChange(key, "increment")}
                    className="h-6 w-6 text-xl bg-sky-600 text-white p-1 rounded cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="my-10">
            <h4 className="text-lg font-medium px-2 pb-2">
              Describe about the features of your place?
            </h4>
            <ul className="flex items-center flex-wrap gap-3 mb-10">
              {facilities.map((card) => (
                <li
                  key={card.label}
                  onClick={() => handleSelectAmenities(card.label)}
                  className={`ring-1 ${
                    amenities.includes(card.label)
                      ? "ring-sky-600"
                      : "ring-slate-900/5"
                  } flex items-center gap-3 bg-white p-4 rounded cursor-default`}
                >
                  <div>{card.icon}</div>
                  <p>{card.label}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Upload Images */}
          <div className="my-10">
            <h4 className="h-4 my-6 text-lg font-medium px-2 pb-2 mb-12 sm:mb-5">
              Include images showcasing your property?
              <span className="text-red-500">*</span>
            </h4>
            {/* Image Upload */}
            <DragDropContext
              onDragEnd={handleDragPhoto}
              className="mt-20 sm:mt-0"
            >
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 bg-gray-600 rounded-lg shadow-lg"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {/* Preview Images */}
                    {photos.length >= 1 && (
                      <>
                        {photos.map((image, index) => (
                          <Draggable
                            key={image.id}
                            draggableId={image.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="relative group"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <img
                                  src={image.url}
                                  alt="Preview"
                                  className="aspect-square object-cover h-52 w-full rounded-lg shadow-md"
                                />
                                <button
                                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-200"
                                  onClick={() => handleRemovePhoto(image.id)}
                                >
                                  <BiTrash className="text-red-600" />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </>
                    )}

                    {provided.placeholder}

                    {/* Upload Button */}

                    <div className="flex items-center justify-center">
                      <label
                        htmlFor="fileInput"
                        className="group flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-400 hover:border-gray-400/90 transition-colors cursor-pointer aspect-square"
                      >
                        <div className="w-full flex items-center justify-center pb-4">
                          <IoIosImages className="text-6xl text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                        <p className="text-sm text-gray-400 group-hover:text-gray-600">
                          Upload from your device
                        </p>
                      </label>
                      <input
                        id="fileInput"
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/*"
                        onChange={handleUploadPhotos}
                      />
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Error Messages */}
            {photosError && (
              <p className="text-red-500 text-sm p-2">{photosError}</p>
            )}
          </div>

          {/* propery title and description */}
          <div className="my-10">
            <h4 className="h-4 my-6 text-lg font-medium px-2 pb-2">
              How would your characterize the charm and excitement of your
              property?
            </h4>
            <div className="mt-20 sm:mt-0">
              <div>
                <label className="block text-gray-700 font-medium pb-1">
                  Property Title/Name:<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  className={`outline-none border-none ring-1 mb-1 p-2 w-full ${
                    errors.name ? "ring-red-600" : "ring-gray-300"
                  } rounded-md shadow-sm focus:ring-sky-600`}
                  placeholder="Enter property title/name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium pb-1">
                  Description:<span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={10}
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className={`outline-none border-none ring-1 mb-0 p-2 w-full ${
                    errors.description ? "ring-red-600" : "ring-gray-300"
                  } rounded-md shadow-sm focus:ring-sky-600`}
                  placeholder="Enter property description"
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="mb-2">
                <h4 className="block text-gray-700 font-medium">
                  Is this property for Buy or Rent?
                  <span className="text-red-500">*</span>
                </h4>

                <div className="flex gap-8">
                  {radios.map((value, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="radio"
                        value={value}
                        {...register("propertyType", {
                          required: "Please select an option",
                        })}
                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 "
                      />
                      <span className="ml-2 text-gray-700">{value}</span>
                    </label>
                  ))}
                </div>
                {errors.propertyType && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.propertyType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Price:<span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <div className="flex justify-start items-baseline">
                    {/* Currency Symbol */}
                    <span className="absolute left-0 top-2 flex items-center pl-3 text-gray-500">
                      ₹
                    </span>
                    {/* Input Field */}
                    <FormattedNumberInput
                      value={watch("price") || ""}
                      onChange={(value) => {
                        // Ensure the value is properly converted to a number
                        const numericValue = value ? parseInt(value.toString().replace(/,/g, ""), 10) : "";
                        setValue("price", numericValue);
                      }}
                      onBlur={() => {}}
                      placeholder="e.g., 35,00,000"
                      className={`pl-8 pr-4 py-2 ${errors.price ? "ring-red-600" : "ring-gray-300"}`}
                    />
                    {selectedRadioOptions === "rent" && (
                      <span className="ml-3 text-xl">/month</span>
                    )}
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-sm">
                      {errors.price.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            className="flex items-center justify-center border-2 border-sky-700 bg-sky-700 text-white w-40 my-5 px-4 py-2 rounded-md hover:bg-sky-600 hover:border-sky-600 transition-colors duration-300 disabled:bg-sky-500 disabled:cursor-not-allowed disabled:hover:border-sky-500"
            disabled={loading}
          >
            {loading || error ? (
              <BlocksShuffle2 className="w-6 h-6" />
            ) : (
              "Update Property"
            )}
          </button>
        </form>
      </section>
    </div>
  );
};

export default EditProperty;
