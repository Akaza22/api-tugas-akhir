import { Router } from 'express';
import { body } from 'express-validator';

import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
} from '../controllers/roleController';

import { authMiddleware, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validation';

const router = Router();

// GET /api/roles - public atau bisa juga pakai authMiddleware kalau mau
router.get('/', authMiddleware, getRoles);

// GET /api/roles/:id - juga dilindungi auth
router.get('/:id', authMiddleware, getRoleById);

// POST /api/roles - hanya admin yang bisa create role
router.post(
  '/',
  authMiddleware,
  requireRole(['admin']),
  [
    body('name').notEmpty().withMessage('Role name is required'),
  ],
  validate,
  createRole
);

// PUT /api/roles/:id - hanya admin yang bisa update role
router.put(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  [
    body('name').notEmpty().withMessage('Role name is required'),
  ],
  validate,
  updateRole
);

// DELETE /api/roles/:id - hanya admin yang bisa delete role
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['admin']),
  deleteRole
);

export default router;
