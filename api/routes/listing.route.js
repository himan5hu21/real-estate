import express from "express";
import {
  createListing,
  deleteListing,
  getOwnerDetail,
  getSingleListing,
  listingProperty,
  searchListing,
  updateListing,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'real-estate',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/create", verifyToken, upload.array("images", 10), createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.put("/update/:id", verifyToken, upload.array("images", 10), updateListing);
router.get("/list/:id", getSingleListing);
router.get("/owner/:id", getOwnerDetail);
router.get("/list", listingProperty);
router.get("/search", searchListing);
router.post("/favorites/:listingId", verifyToken, addToFavorites);
router.delete("/favorites/:listingId", verifyToken, removeFromFavorites);
router.get("/favorites", verifyToken, getFavorites);

export default router;
