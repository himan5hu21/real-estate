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

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.put("/update/:id", verifyToken, updateListing);
router.get("/list/:id", getSingleListing);
router.get("/owner/:id", getOwnerDetail);
router.get("/list", listingProperty);
router.get("/search", searchListing);
router.post("/favorites/:listingId", verifyToken, addToFavorites);
router.delete("/favorites/:listingId", verifyToken, removeFromFavorites);
router.get("/favorites", verifyToken, getFavorites);

export default router;
