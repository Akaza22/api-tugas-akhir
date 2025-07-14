import { Router } from 'express';
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
import { uploadNewsFiles } from '../middlewares/uploadNewsFiles';

const router = Router();


router.get('/', getAllNews);
router.get('/:id', getNewsById);

router.post(
  '/',
  authMiddleware,
  uploadNewsFiles,
  [
    body('title').notEmpty().withMessage('Title is required')
  ],
  validate,
  createNews
);

router.put(
  '/:id',
  authMiddleware,
  uploadNewsFiles,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional()
  ],
  validate,
  updateNews
);

router.delete('/:id', authMiddleware, deleteNews);

export default router;
