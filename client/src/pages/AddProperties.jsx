import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { categories, types, facilities } from "../assets/resources/data";
import BlocksShuffle2 from "../assets/svgs/blocks-shuffle-2";
import { 
  HiOutlineCloudUpload, 
  HiOutlineTrash, 
  HiOutlinePlus, 
  HiOutlineMinus 
} from "react-icons/hi";
import { FaRupeeSign } from "react-icons/fa";

// Utility: Number Formatting
const formatNumber = (value) => {
  if (!value || value === "") return "";
  const num = parseInt(value.toString().replace(/,/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString('en-IN');
};

const parseNumber = (value) => {
  if (!value) return "";
  return value.toString().replace(/,/g, "");
};

const PropertyForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  
  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      guestCount: 1,
      bedroomsCount: 1,
      bedCount: 1,
      bathroomsCount: 1,
      propertyType: "rent",
      price: "",
      postalCode: ""
    }
  });

  // Local State
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [photos, setPhotos] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAreaType, setSelectedAreaType] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const watchPrice = watch("price");
  const watchPropertyType = watch("propertyType");
  const watchDetails = watch();

  // --- 1. INITIAL FETCH ---
  useEffect(() => {
    if (isEditMode) {
      const fetchProperty = async () => {
        try {
          const res = await axios.get(`/api/listing/list/${id}`);
          const property = res.data.listing;

          setSelectedCategory(property.category);
          setSelectedAreaType(property.area);
          setSelectedAmenities(property.features);
          
          setPhotos(
            property.imageUrls.map((url, index) => ({
              id: `existing-${index}`,
              url,
              file: null,
            }))
          );

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
            guestCount: property.guestrooms,
            bedroomsCount: property.bedrooms,
            bedCount: property.beds,
            bathroomsCount: property.bathrooms,
          });
        } catch (err) {
          console.error("Error fetching property:", err);
          setSubmitError("Failed to fetch property details.");
        }
      };
      fetchProperty();
    }
  }, [id, isEditMode, reset]);

  // --- 2. HANDLERS ---
  const handleCounter = (field, operation) => {
    const currentVal = watchDetails[field] || 0;
    const newVal = operation === 'inc' ? currentVal + 1 : Math.max(1, currentVal - 1);
    setValue(field, newVal);
  };

  const toggleAmenity = (label) => {
    if (selectedAmenities.includes(label)) {
      setSelectedAmenities(prev => prev.filter(a => a !== label));
    } else {
      setSelectedAmenities(prev => [...prev, label]);
    }
  };

  const handleUploadPhotos = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: `${file.name}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file
    }));
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


  // --- 3. SUBMIT LOGIC ---
  const onSubmit = async (data) => {
    if (!selectedCategory) return setSubmitError("Please select a property category.");
    if (!selectedAreaType) return setSubmitError("Please select the type of place.");
    if (photos.length === 0) return setSubmitError("Please upload at least one photo.");

    setLoading(true);
    setSubmitError("");

    try {
      const formDataToSend = new FormData();
      
      // Basic info
      formDataToSend.append("userRef", currentUser._id);
      formDataToSend.append("name", data.name);
      formDataToSend.append("description", data.description);
      formDataToSend.append("price", parseInt(data.price.toString().replace(/,/g, ""), 10));
      formDataToSend.append("type", data.propertyType);
      formDataToSend.append("bedrooms", data.bedroomsCount);
      formDataToSend.append("bathrooms", data.bathroomsCount);
      formDataToSend.append("guestrooms", data.guestCount);
      formDataToSend.append("beds", data.bedCount);
      formDataToSend.append("area", selectedAreaType);
      formDataToSend.append("category", selectedCategory);

      // Objects/Arrays as JSON strings
      formDataToSend.append("address", JSON.stringify({
        streetAddress: data.streetAddress,
        city: data.city,
        state: data.state,
        country: data.country,
        postalCode: parseInt(data.postalCode, 10),
      }));
      formDataToSend.append("features", JSON.stringify(selectedAmenities));

      // Append image order (mix of existing URLs and new file markers)
      const newFiles = photos.filter(p => p.file);
      photos.forEach((photo) => {
        if (photo.file) {
          const index = newFiles.indexOf(photo);
          formDataToSend.append("imageUrls", `__NEW_FILE_${index}__`);
        } else {
          formDataToSend.append("imageUrls", photo.url);
        }
      });

      // Append New Files
      newFiles.forEach((photo) => {
        formDataToSend.append("images", photo.file);
      });

      let res;
      if (isEditMode) {
        res = await axios.put(`/api/listing/update/${id}`, formDataToSend);
      } else {
        res = await axios.post("/api/listing/create", formDataToSend);
      }

      const responseData = res.data;
      if (!responseData.success) {
        setSubmitError(responseData.message);
        return;
      }

      navigate("/", { replace: true });
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // --- REUSABLE COMPONENTS ---
  const SectionHeader = ({ step, title }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-sky-100 text-sky-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
          Step {step}
        </span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {isEditMode ? "Edit Property" : "Add New Property"}
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditMode ? "Update your property details below" : "Fill in the details to list your property"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        
        {/* Step 1: Category */}
        <section>
          <SectionHeader step="01" title="Which describes your place best?" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.filter(c => c.label !== "All").map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => setSelectedCategory(cat.label)}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200
                  ${selectedCategory === cat.label 
                    ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm'}
                `}
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <span className="text-sm font-semibold text-center">{cat.label}</span>
              </button>
            ))}
          </div>
          {!selectedCategory && submitError && <p className="text-rose-500 text-sm mt-2 font-medium">Please select a category</p>}
        </section>

        <div className="h-px bg-slate-200" />

        {/* Step 2: Type of Place */}
        <section>
          <SectionHeader step="02" title="What type of place will guests have?" />
          <div className="grid md:grid-cols-3 gap-4">
            {types.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setSelectedAreaType(t.name)}
                className={`
                  p-6 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col gap-2
                  ${selectedAreaType === t.name 
                    ? 'border-sky-500 bg-sky-50 shadow-sm' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'}
                `}
              >
                <span className="text-3xl text-slate-700">{t.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{t.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{t.description}</p>
                </div>
              </button>
            ))}
          </div>
          {!selectedAreaType && submitError && <p className="text-rose-500 text-sm mt-2 font-medium">Please select a property type</p>}
        </section>

        <div className="h-px bg-slate-200" />

        {/* Step 3: Location */}
        <section>
          <SectionHeader step="03" title="Where is your place located?" />
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Street Address</label>
                <input 
                  {...register("streetAddress", { required: "Required" })}
                  placeholder="e.g. 123 Main St" 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 focus:bg-white transition-colors text-slate-900 placeholder:text-slate-400"
                />
                {errors.streetAddress && <p className="text-rose-500 text-xs mt-1">{errors.streetAddress.message}</p>}
              </div>
              
              {['city', 'state', 'country'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-bold text-slate-700 mb-2 capitalize">{field}</label>
                  <input 
                    {...register(field, { required: "Required" })}
                    placeholder={`e.g. ${field === 'city' ? 'Mumbai' : field === 'state' ? 'Maharashtra' : 'India'}`}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 focus:bg-white transition-colors text-slate-900 placeholder:text-slate-400"
                  />
                  {errors[field] && <p className="text-rose-500 text-xs mt-1">{errors[field].message}</p>}
                </div>
              ))}
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Postal Code</label>
                <input 
                  type="number"
                  {...register("postalCode", { required: "Required", pattern: { value: /^[0-9]{6}$/, message: "Invalid code" } })}
                  placeholder="e.g. 400001" 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 focus:bg-white transition-colors text-slate-900 placeholder:text-slate-400"
                />
                {errors.postalCode && <p className="text-rose-500 text-xs mt-1">{errors.postalCode.message}</p>}
              </div>
            </div>
          </div>
        </section>

        <div className="h-px bg-slate-200" />

        {/* Step 4: Details */}
        <section>
          <SectionHeader step="04" title="Share some basics about your place" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Guests', icon: '👤', key: 'guestCount' },
              { label: 'Bedrooms', icon: '🛏️', key: 'bedroomsCount' },
              { label: 'Beds', icon: '🛋️', key: 'bedCount' },
              { label: 'Bathrooms', icon: '🚿', key: 'bathroomsCount' },
            ].map((item) => (
              <div key={item.key} className="bg-white border-2 border-slate-200 rounded-2xl p-6 flex flex-col items-center">
                <span className="text-2xl mb-2">{item.icon}</span>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{item.label}</span>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => handleCounter(item.key, 'dec')} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 border border-slate-300 transition-colors">
                    <HiOutlineMinus />
                  </button>
                  <span className="text-xl font-bold text-slate-900 w-6 text-center">{watchDetails[item.key]}</span>
                  <button type="button" onClick={() => handleCounter(item.key, 'inc')} className="p-2 rounded-full bg-slate-900 text-white hover:bg-slate-700 transition-colors">
                    <HiOutlinePlus />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px bg-slate-200" />

        {/* Step 5: Amenities */}
        <section>
          <SectionHeader step="05" title="What amenities do you offer?" />
          <div className="flex flex-wrap gap-3">
            {facilities.map((f) => (
              <button
                key={f.label}
                type="button"
                onClick={() => toggleAmenity(f.label)}
                className={`
                  px-5 py-3 rounded-xl border-2 flex items-center gap-2 font-medium transition-all duration-200
                  ${selectedAmenities.includes(f.label) 
                    ? 'border-sky-500 bg-sky-50 text-sky-700' 
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}
                `}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="h-px bg-slate-200" />

        {/* Step 6: Photos */}
        <section>
          <SectionHeader step="06" title="Add some photos of your place" />
          <DragDropContext onDragEnd={handleDragPhoto}>
            <Droppable droppableId="photos" direction="horizontal">
              {(provided) => (
                <div 
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {photos.map((photo, index) => (
                    <Draggable key={photo.id} draggableId={photo.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200"
                        >
                          <img src={photo.url} alt="Property" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                            className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-rose-500 hover:text-rose-600 shadow-sm"
                          >
                            <HiOutlineTrash />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {/* Upload Button */}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 hover:bg-sky-50 transition-all group">
                    <HiOutlineCloudUpload className="text-3xl text-slate-400 group-hover:text-sky-500 mb-2" />
                    <span className="text-sm font-bold text-slate-500 group-hover:text-sky-600">Upload Photos</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleUploadPhotos} />
                  </label>
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {!photos.length && submitError && <p className="text-rose-500 text-sm mt-2 font-medium">Please upload at least 1 photo</p>}
        </section>

        <div className="h-px bg-slate-200" />

        {/* Step 7: Description & Price */}
        <section>
          <SectionHeader step="07" title="Final details" />
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 grid md:grid-cols-2 gap-8">
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                <input 
                  {...register("name", { required: "Required" })}
                  placeholder="e.g. Luxurious Villa in Bali" 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 focus:bg-white transition-colors text-slate-900 placeholder:text-slate-400"
                />
                {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea 
                  rows={5}
                  {...register("description", { required: "Required" })}
                  placeholder="Tell us about the property..."
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-sky-500 focus:bg-white transition-colors text-slate-900 placeholder:text-slate-400 resize-none"
                />
                {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
            </div>

            <div className="space-y-6">
               <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Listing Type</label>
                <div className="flex gap-4">
                  {['buy', 'rent'].map((option) => (
                    <label key={option} className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${watchPropertyType === option ? 'border-sky-500 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" value={option} {...register("propertyType")} className="hidden" />
                        <div>
                          <span className="font-bold text-slate-900 capitalize">{option === 'buy' ? 'Sell' : 'Rent'}</span>
                          <p className="text-xs text-slate-500 mt-1">Property for {option}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Price</label>
                <div className="relative">
                  <div className="flex items-center w-full bg-white border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/10 transition-all">
                    <div className="pl-4 text-slate-400">
                      <FaRupeeSign />
                    </div>
                    <input
                      type="text"
                      {...register("price", { required: "Required" })}
                      placeholder="e.g. 50,00,000"
                      className="w-full bg-transparent border-none outline-none px-3 py-3.5 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal"
                      value={watchPrice ? formatNumber(parseNumber(watchPrice)) : ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setValue('price', val);
                      }}
                    />
                  </div>
                  {watchPropertyType === 'rent' && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">/ month</span>}
                </div>
                {errors.price && <p className="text-rose-500 text-xs mt-1">{errors.price.message}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="px-8 py-4 rounded-xl font-bold text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-10 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <BlocksShuffle2 className="w-6 h-6 animate-spin" /> : (isEditMode ? 'Update Property' : 'Create Listing')}
          </button>
        </div>

        {submitError && (
          <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-center border border-rose-100 font-medium">
            {submitError}
          </div>
        )}
      </form>
    </div>
  );
};

export default PropertyForm;