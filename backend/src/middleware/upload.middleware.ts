import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";

// Allowed formats
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    if (!ALLOWED_FORMATS.includes(file.mimetype)) {
      throw new Error("Unsupported file type");
    }

    if (file.mimetype === "application/pdf") {
      return {
        folder: "jobs/pdfs",
        resource_type: "raw",
      };
    } else {
      return {
        folder: "jobs/images",
        resource_type: "image",
      };
    }
  },
});

export const parser = multer({ storage });