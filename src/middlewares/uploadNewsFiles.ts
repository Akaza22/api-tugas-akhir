// middlewares/uploadNewsFiles.ts
import multer from 'multer';
import { cloudinaryStorage } from '../utils/cloudinaryStorage';

const upload = multer({ storage: cloudinaryStorage });

export const uploadNewsFiles = upload.fields([
  { name: 'banner', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]);
