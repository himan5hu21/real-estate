import express from "express";
import {
  createListing,
  deleteListing,
  listingProperty,
  searchListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.get("/list", listingProperty);
router.get("/search", searchListing);

export default router;
