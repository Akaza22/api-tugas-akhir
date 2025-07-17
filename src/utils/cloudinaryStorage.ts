// utils/cloudinaryStorage.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => {
    // Tentukan jenis resource
    const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'raw';

    return {
      folder: 'news_files', // Folder Cloudinary
      public_id: file.originalname.split('.')[0], // Nama file tanpa ekstensi
      resource_type: resourceType, // 'image' atau 'raw' (untuk pdf, zip, dll)
    };
  },
});
