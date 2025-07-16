import { Router } from 'express';
import { approveNews, checkExpiredApprovals, getApprovalsByNews, rejectNews } from '../controllers/approvalController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/:news_id/approve', authMiddleware, approveNews);
router.get('/:news_id', authMiddleware, getApprovalsByNews);
router.post('/:news_id/reject', authMiddleware, rejectNews);
router.get('/check-expiry', checkExpiredApprovals);


export default router;
