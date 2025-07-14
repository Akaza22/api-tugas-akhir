import multer from 'multer';
import { bannerStorage } from '../utils/cloudinaryImage';
import { pdfStorage } from '../utils/cloudinaryPdf';
import { Request, Response, NextFunction } from 'express';

const uploadBanner = multer({ storage: bannerStorage }).single('banner');
const uploadPdf = multer({ storage: pdfStorage }).single('pdf');

export const uploadNewsFiles = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  uploadBanner(req, res, (err: any) => {
    if (err) return next(err);

    if (req.file) {
      req.files = { ...req.files, banner: [req.file] };
    }

    uploadPdf(req, res, (err2: any) => {
      if (err2) return next(err2);

      if (req.file) {
        req.files = { ...req.files, pdf: [req.file] };
      }

      next();
    });
  });
};
