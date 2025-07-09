import express from "express";
import {
  createListing,
  deleteListing,
  getOwnerDetail,
  getSingleListing,
  listingProperty,
  searchListing,
  updateListing,
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

export default router;
