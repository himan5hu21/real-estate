import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import { phone } from "phone";
import { validate } from "email-validator";
import Listing from "../models/listing.model.js";

export const test = (req, res) => {
  res.json({
    message: "Api router is working!",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const allowedUpdates = [
      "name",
      "email",
      "username",
      "avatar",
      "phone",
      "address",
      "preferences",
    ];

    const requiredFields = ["email", "username"];

    const filteredUpdates = {};
    const fieldsToUnset = {};

    const checkRequiredFields = (key, value) => {
      if (!value) {
        return next(errorHandler(400, `${key} is a required fields.`));
      }
    };

    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        if (updates[key] !== undefined && updates[key] !== null) {
          if (updates[key].trim() !== "") {
            // Add to filtered updates if the value is valid

            filteredUpdates[key] = updates[key];
          } else {
            // Mark for deletion if the value is an empty string
            if (requiredFields.includes(key)) {
              checkRequiredFields(key, updates[key]);
            }
            fieldsToUnset[key] = ""; // Use "" as the value for $unset
          }
        } else {
          // Mark for deletion if the value is undefined or null
          if (requiredFields.includes(key)) {
            checkRequiredFields(key, updates[key]);
          }
          fieldsToUnset[key] = ""; // Use "" as the value for $unset
        }
      }
    });

    if (filteredUpdates.phone) {
      const checkPhone = phone("+91" + filteredUpdates.phone, "IND");
      if (!checkPhone.isValid) {
        return next(errorHandler(400, "Please fill valid phone number"));
      }
    }

    if (filteredUpdates.email && !validate(filteredUpdates.email)) {
      return next(errorHandler(400, "Please fill a valid email address"));
    }

    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    if (
      filteredUpdates.username &&
      !usernameRegex.test(filteredUpdates.username)
    ) {
      return next(errorHandler(400, "Please fill a valid username"));
    }

    const updateQuery = {};
    if (Object.keys(filteredUpdates).length > 0) {
      updateQuery.$set = filteredUpdates;
    }
    if (Object.keys(fieldsToUnset).length > 0) {
      updateQuery.$unset = fieldsToUnset;
    }

    if (Object.keys(updateQuery).length === 0) {
      return next(errorHandler(400, "No valid fields to update"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateQuery,
      { new: true }
    ).select("-password"); // Explicitly exclude password in the return

    if (!updatedUser) {
      return next(errorHandler(404, "User not found!"));
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserPassword = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));

  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const isMatch = bcryptjs.compareSync(currentPassword, user.password);
    if (!isMatch) {
      return next(errorHandler(401, "Invalid current password"));
    }

    const isNewPasswordSame = bcryptjs.compareSync(newPassword, user.password);
    if (isNewPasswordSame) {
      return next(
        errorHandler(400, "New password cannot be the same as the old password")
      );
    }

    user.password = bcryptjs.hashSync(newPassword, 10);
    await user.save();

    const userData = { ...user._doc };
    delete userData.password;

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ success: true, message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    if (!req.user || !req.params.id) {
      return next(errorHandler(400, "Invalid request parameters"));
    }

    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You can only view your own lisitings!"));
    }

    const listings = await Listing.find({ userRef: req.params.id });

    res
      .status(200)
      .json({
        success: true,
        message: "Listings fetched successfully",
        listings,
      });
  } catch (error) {
    next(error);
  }
};
