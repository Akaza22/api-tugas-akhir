import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController';
import { validate } from '../middlewares/validation';

const router = Router();

router.post('/register',
  [
    body('fullname').notEmpty().withMessage('Full name is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role_id').isInt({ min: 1 }).withMessage('Role ID must be a valid number')
  ],
  validate,
  register
);

router.post('/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

export default router;
