import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

export const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: 'pdfs',
    resource_type: 'raw',
    allowed_formats: ['pdf'],
    public_id: () => `news-pdf-${Date.now()}`
  })
});
