import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (err) {
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

    const deletedListing = await Listing.findByIdAndDelete(req.params.id);

    if (!deletedListing)
      return next(
        errorHandler(500, "Failed to delete listing. Please try again.")
      );

    return res
      .status(200)
      .json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listingId = req.params.id;

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      { $set: req.body },
      { new: true }
    );

    if (!updatedListing) {
      return next(errorHandler(404, "Property not found"));
    }

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
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
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
    console.error("Error fetching listing:", err.message);
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
