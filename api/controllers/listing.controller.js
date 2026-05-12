import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const folderAndId = parts.slice(-2).join("/"); // "folder/filename.ext"
  return folderAndId.split(".")[0]; // "folder/filename"
};

// Safe helper to handle both stringified JSON and individual FormData appends
const parseField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    const parsed = JSON.parse(field);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    // If it's a string that's not JSON (like "__NEW_FILE_0__"), return it as a single-item array
    return [field];
  }
};

export const createListing = async (req, res, next) => {
  try {
    let listingData = { ...req.body };
    
    // Handle FormData stringified objects if necessary
    if (typeof listingData.address === "string") {
      try {
        listingData.address = JSON.parse(listingData.address);
      } catch (e) {
        console.error("Error parsing address:", e);
      }
    }
    
    // Use the same safe helper for features
    listingData.features = parseField(listingData.features);

    // Process images in order
    const newUrls = req.files 
      ? req.files.map(file => file.path) 
      : [];

    const imageUrlOrder = parseField(listingData.imageUrls);
    
    if (imageUrlOrder.length > 0) {
      listingData.imageUrls = imageUrlOrder.map(item => {
        if (typeof item === 'string' && item.startsWith('__NEW_FILE_')) {
          const index = parseInt(item.replace('__NEW_FILE_', '').replace('__', ''));
          return newUrls[index];
        }
        return item;
      }).filter(url => url !== undefined);
    } else {
      listingData.imageUrls = newUrls;
    }
    listingData.userRef = req.user.id;

    const listing = await Listing.create(listingData);
    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (err) {
    console.error("Error creating listing:", err);
    next(err);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) return next(errorHandler(404, "Listing not found!"));

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only delete your own listings!"));
    }

    // Cleanup images from Cloudinary
    if (listing.imageUrls && listing.imageUrls.length > 0) {
      for (const url of listing.imageUrls) {
        if (url.includes("cloudinary")) {
          const publicId = getPublicIdFromUrl(url);
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    await Listing.findByIdAndDelete(req.params.id);

    return res
      .status(200)
      .json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only update your own listings!"));
    }

    let updateData = { ...req.body };

    // Handle FormData stringified objects
    if (typeof updateData.address === "string") {
      try {
        updateData.address = JSON.parse(updateData.address);
      } catch (e) {
        console.error("Error parsing address:", e);
      }
    }
    
    updateData.features = parseField(updateData.features);

    // Handle images
    const newUrls = req.files 
      ? req.files.map(file => file.path) 
      : [];

    if (updateData.imageUrls) {
      const imageUrlOrder = parseField(updateData.imageUrls);
      
      updateData.imageUrls = imageUrlOrder.map(item => {
        if (typeof item === 'string' && item.startsWith('__NEW_FILE_')) {
          const index = parseInt(item.replace('__NEW_FILE_', '').replace('__', ''));
          return newUrls[index];
        }
        return item; // It's an existing URL
      }).filter(url => url !== undefined);
    } else {
      updateData.imageUrls = newUrls;
    }

    // Cleanup deleted images from Cloudinary
    const imagesToDelete = listing.imageUrls.filter(url => !updateData.imageUrls.includes(url));
    for (const url of imagesToDelete) {
      if (url.includes("cloudinary")) {
        const publicId = getPublicIdFromUrl(url);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.error("Error updating listing:", error.message);
    next(error);
  }
};

export const listingProperty = async (req, res, next) => {
  try {
    const {
      type,
      category,
      minprice,
      maxprice,
      bedrooms,
      sort,
      city,
      page = 1,
      limit = 20,
    } = req.query;

    let filter = {};
    if (type) filter.type = type;
    if (category) filter.category = new RegExp(category, "i");
    if (city) filter["address.city"] = new RegExp(city, "i");
    if (minprice || maxprice) {
      filter.price = {};
      if (minprice) filter.price.$gte = Number(minprice);
      if (maxprice) filter.price.$lte = Number(maxprice);
    }
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };

    let sortOptions = {};
    if (sort === "low-to-high") sortOptions.price = 1;
    else if (sort === "high-to-low") sortOptions.price = -1;
    else if (sort === "latest") sortOptions.createdAt = -1;

    const skip = (Number(page) - 1) * Number(limit);
    const properties = await Listing.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const totalProperties = await Listing.countDocuments(filter);

    res.status(200).json({
      success: true,
      properties,
      totalProperties,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProperties / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

export const searchListing = async (req, res, next) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;

    if (!keyword || keyword.trim() === "") {
      return next(errorHandler(400, "Please provide a valid keyword"));
    }

    const regex = new RegExp(keyword, "i");

    const filter = {
      $or: [
        { name: regex },
        { description: regex },
        { "address.streetAddress": regex },
        { "address.city": regex },
        { "address.state": regex },
        { "address.country": regex },
      ],
    };

    const skip = (Number(page) - 1) * Number(limit);
    const properties = await Listing.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalProperties = await Listing.countDocuments(filter);
    const totalPages = Math.ceil(totalProperties / Number(limit));

    res.status(200).json({
      success: true,
      properties,
      totalProperties,
      currentPage: Number(page),
      totalPages,
    });
  } catch (err) {
    next(err);
  }
};

export const getSingleListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Property not found"));
    }

    res.status(200).json({
      success: true,
      listing,
    });
  } catch (err) {
    next(err);
  }
};

export const getOwnerDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const owner = await User.findById(id).select("-password");

    if (!owner) {
      return next(errorHandler(404, "Owner not found"));
    }

    res.status(200).json({
      success: true,
      owner,
    });
  } catch (err) {
    console.error("Error fetching owner details:", err.message);
    next(err);
  }
};

export const addToFavorites = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    // Find user and check if listing is already in favorites
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    if (user.favorites.includes(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Listing is already in favorites",
      });
    }

    // Add listing to favorites
    user.favorites.push(listingId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Listing added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Error adding to favorites:", error.message);
    next(error);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    // Find user and remove listing from favorites
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    if (!user.favorites.includes(listingId)) {
      return res.status(400).json({
        success: false,
        message: "Listing is not in favorites",
      });
    }

    // Remove listing from favorites
    user.favorites = user.favorites.filter(id => id.toString() !== listingId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Listing removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    console.error("Error removing from favorites:", error.message);
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate('favorites');
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      favorites: user.favorites,
      count: user.favorites.length,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error.message);
    next(error);
  }
};
