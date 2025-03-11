import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

interface CloudinaryParams {
  folder: string; 
  allowed_formats: string[];
  transformation: { width: number; height: number; crop: string }[];
}


cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pics',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp',], 
    transformation: [{ width: 500, height: 500, crop: 'limit' }] 
  } as CloudinaryParams 
});

const upload = multer({ storage });

export default upload;