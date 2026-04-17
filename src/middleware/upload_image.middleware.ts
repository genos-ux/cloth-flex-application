// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../config/cloudinary";
//
// // Configure Cloudinary storage
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: (req, file) => {
//     return {
//       folder: "clothflex/products",
//       allowed_formats: ["jpg", "jpeg", "png", "webp"],
//       transformation: [{ width: 800, crop: "limit" }],
//       resource_type: "image"
//     };
//   },
// });
//
// export const upload = multer({ storage });

// upload.ts
import multer from "multer";

const storage = multer.memoryStorage(); // Store files in RAM temporarily
export const upload = multer({ storage });