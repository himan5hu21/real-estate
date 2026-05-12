import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { app } from "../firebase/firebaseConfig";
import {
  requestCancelled,
  requestFailure,
  requestStart,
  signOutSuccess,
  updateUserSuccess,
} from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";
import { deleteUser, updateUser, userSignOut } from "../services/service";

export const useProfileForm = (currentUser) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(currentUser);
  const [newImage, setNewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trueValue = value.trim().length > 0 ? value : "";
    setFormData({
      ...formData,
      [name]: trueValue,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // Limit file size to 2MB
        setFileUploadError(true);
        return;
      }
      const imageUrl = URL.createObjectURL(file); // Temporary URL for image preview
      setNewImage(imageUrl); // Display preview of the new image
      setFileUploadError(false);
    }
  };

  const handleFileUpload = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const timestamp = new Date().getTime();
      const fileName = `profileImages/${currentUser._id}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFilePerc(Math.round(progress));
        },
        (error) => {
          setFileUploadError(true);
          dispatch(requestFailure(error.message));
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          resolve(downloadURL);
        }
      );
    });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setFormData(currentUser);
    setNewImage(null); // Reset image preview when exiting edit mode
    setFileUploadError(false);
    setFilePerc(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(requestStart());

    try {
      const data1 = new FormData(e.target);
      let updatedFormData = Object.fromEntries(data1);

      if (newImage) {
        const file = e.target["image-upload"].files[0];
        if (file) {
          const downloadURL = await handleFileUpload(file);
          updatedFormData = { ...updatedFormData, avatar: downloadURL };
        }
      }


      const res = await updateUser(currentUser._id, updatedFormData);
      const data = await res.data;
      if (!data.success) {
        dispatch(requestFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      toggleEditMode();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to authenticate due to an internal error. Please try again later.";
      dispatch(requestFailure(errorMessage));
    }
  };

  const handleCancel = () => {
    toggleEditMode();
    dispatch(requestCancelled());
  };

  const handleLogOut = async () => {
    dispatch(requestStart());
    requestStart();
    try {
      const res = await userSignOut();
      const data = await res.data;
      if (!data.success) {
        requestFailure(data.message);
        return;
      }
      dispatch(signOutSuccess());
      navigate("/", { replace: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to authenticate due to an internal error. Please try again later.";
      dispatch(requestFailure(errorMessage));
    }
  };

  const handleDeleteAccount = async () => {
    dispatch(requestStart());
    try {
      const res = await deleteUser(currentUser._id);
      const data = await res.data;
      if (!data.success) {
        dispatch(requestFailure(data.message));
        return;
      }
      dispatch(signOutSuccess());
      navigate("/", { replace: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to authenticate due to an internal error. Please try again later.";
      dispatch(requestFailure(errorMessage));
    }
  };

  return {
    formData,
    setFormData,
    newImage,
    isEditing,
    fileUploadError,
    filePerc,
    handleSubmit,
    handleChange,
    handleImageChange,
    toggleEditMode,
    handleCancel,
    handleDeleteAccount,
    handleLogOut,
  };
};

export default useProfileForm;
