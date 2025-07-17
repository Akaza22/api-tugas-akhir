// utils/cloudinaryStorage.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    const ext = path.extname(file.originalname); // Contoh: ".pdf"
    const baseName = path.basename(file.originalname, ext); // Contoh: "brosur"
    const timestamp = Date.now(); // Untuk uniqueness

    const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'raw';

    return {
      folder: 'news_files',
      resource_type: resourceType,
      public_id: `${timestamp}-${baseName}`, // Contoh: "1721273892-brosur"
      format: ext.replace('.', ''), // Misalnya: "pdf"
    };
  },
});
