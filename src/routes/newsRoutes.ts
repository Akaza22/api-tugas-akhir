import { Router } from 'express';
import multer from 'multer';
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/newsController';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { body } from 'express-validator';

const router = Router();

// Konfigurasi upload file
const upload = multer({ dest: 'uploads/' });

router.get('/', getAllNews);
router.get('/:id', getNewsById);

router.post(
  '/',
  authMiddleware,
  upload.fields([{ name: 'banner' }, { name: 'pdf' }]),
  [
    body('title').notEmpty().withMessage('Title is required')
    // content & file optional
  ],
  validate,
  createNews
);

router.put(
  '/:id',
  authMiddleware,
  upload.fields([{ name: 'banner' }, { name: 'pdf' }]),
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional()
  ],
  validate,
  updateNews
);

router.delete('/:id', authMiddleware, deleteNews);

export default router;
