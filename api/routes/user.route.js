import express from "express";
import {
  deleteUser,
  test,
  updateUser,
  updateUserPassword,
  getUserListings,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.patch("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.patch("/update/password/:id", verifyToken, updateUserPassword);
router.get("/listings/:id", verifyToken, getUserListings);

export default router;
