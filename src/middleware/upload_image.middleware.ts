import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    return {
      folder: "clothflex/products",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 800, crop: "limit" }],
    };
  },
});

export const upload = multer({ storage });