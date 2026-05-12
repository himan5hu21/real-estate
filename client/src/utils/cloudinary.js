import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

export default cld;

export const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes("cloudinary")) return null;
  const parts = url.split("/");
  const folderAndId = parts.slice(-2).join("/"); // "folder/filename.ext"
  return folderAndId.split(".")[0]; // "folder/filename"
};
