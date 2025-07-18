import { Router } from 'express';
import {
  getSupervisorsByEmployee,
  createSupervisorRelation,
  updateSupervisorWeight,
  deleteSupervisorRelation
} from '../controllers/supervisorController';
import { authMiddleware, requireRole } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { body, param } from 'express-validator';

const router = Router();

router.use(authMiddleware);

router.get('/:employee_id',
  param('employee_id').isNumeric().withMessage('Employee ID must be numeric'),
  validate,
  getSupervisorsByEmployee
);

router.post(
  '/',
  [
    body('employee_id').isNumeric(),
    body('supervisor_id').isNumeric(),
    body('weight').isInt({ min: 1, max: 100 })
  ],
  validate,
  createSupervisorRelation
);

router.put(
  '/:id',
  [
    param('id').isNumeric(),
    body('weight').isInt({ min: 1, max: 100 })
  ],
  validate,
  updateSupervisorWeight
);

router.delete('/:id',
  param('id').isNumeric(),
  validate,
  deleteSupervisorRelation
);

export default router;
