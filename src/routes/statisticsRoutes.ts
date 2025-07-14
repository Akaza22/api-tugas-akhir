import { Router } from 'express';
import { getStatistics } from '../controllers/statisticsController';
import { authMiddleware, requireRole } from '../middlewares/auth';

const router = Router();

// Bisa batasi hanya admin jika perlu
router.get('/summary', authMiddleware, requireRole(['admin']), getStatistics);


export default router;
