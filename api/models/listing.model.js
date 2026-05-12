import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    guestrooms: {
      type: Number,
      required: true,
    },
    beds: {
      type: Number,
      required: true,
    },
    features: {
      type: Array,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["buy", "rent"],
    },
    imageUrls: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

// Add indexes for faster querying
listingSchema.index({ userRef: 1 });
listingSchema.index({ type: 1 });
listingSchema.index({ category: 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ createdAt: -1 }); // Fast sorting for newest listings

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
