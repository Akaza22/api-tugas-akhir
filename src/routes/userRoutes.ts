import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController';

import { authMiddleware } from '../middlewares/auth';
import { requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { body } from 'express-validator';

const router = Router();

// Semua endpoint di-protect oleh auth, hanya admin yang bisa akses
router.use(authMiddleware, requireRole(['admin']));

router.get('/', getAllUsers);
router.get('/:id', getUserById);

router.post(
  '/',
  [
    body('fullname').notEmpty().withMessage('Fullname is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role_id').isNumeric().withMessage('Role ID must be a number')
  ],
  validate,
  createUser
);

router.put(
  '/:id',
  [
    body('fullname').optional().notEmpty(),
    body('username').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 6 }),
    body('role_id').optional().isNumeric()
  ],
  validate,
  updateUser
);

router.delete('/:id', deleteUser);

export default router;
