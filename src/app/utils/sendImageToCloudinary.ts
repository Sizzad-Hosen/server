import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔁 Ensure 'uploads/' folder exists
const uploadFolder = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage });

// Cloudinary uploader
export const sendImageToCloudinary = (
  imageName: string,
  localPath: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      localPath,
      { public_id: imageName.trim(), folder: 'eduHub' },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        // ✅ Delete temp file after upload
        fs.unlink(localPath, (err) => {
          if (err) console.error("❌ Failed to delete temp file:", err);
          else console.log("✅ Temp file deleted:", localPath);
        });

        resolve(result as UploadApiResponse);
      }
    );
  });
};