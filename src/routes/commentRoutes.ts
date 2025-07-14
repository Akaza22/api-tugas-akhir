import { Router } from 'express';
import { getComments, postComment, deleteComment } from '../controllers/commentController';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { body } from 'express-validator';

const router = Router();

router.get('/news/:news_id/comments', getComments);

router.post(
  '/news/:news_id/comments',
  authMiddleware,
  [
    body('comment').notEmpty().withMessage('Comment is required')
  ],
  validate,
  postComment
);

router.delete(
  '/comments/:id',
  authMiddleware,
  deleteComment
);

export default router;
