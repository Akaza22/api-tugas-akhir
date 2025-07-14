import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  updateUsername,
  updateAvatar
} from '../controllers/profileController';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { body } from 'express-validator';
import multer from 'multer';
import { avatarStorage } from '../utils/cloudinary';

const upload = multer({ storage: avatarStorage });

const router = Router();

router.use(authMiddleware);

router.get('/', getProfile);

router.put(
  '/',
  [
    body('fullname').optional().notEmpty().withMessage('Fullname cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email')
  ],
  validate,
  updateProfile
);

router.put(
  '/password',
  [
    body('old_password').notEmpty().withMessage('Old password is required'),
    body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  validate,
  changePassword
);

router.put(
    '/username',
    [body('username').notEmpty().withMessage('Username is required')],
    validate,
    updateUsername
  );
  
  router.put(
    '/avatar',
    upload.single('avatar'),
    updateAvatar
  );
  

export default router;
