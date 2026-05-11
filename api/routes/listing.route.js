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
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
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
