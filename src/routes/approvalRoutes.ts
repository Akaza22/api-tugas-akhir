import { Router } from 'express';
import { approveNews, getApprovalsByNews } from '../controllers/approvalController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/:news_id/approve', authMiddleware, approveNews);
router.get('/:news_id', authMiddleware, getApprovalsByNews);

export default router;
