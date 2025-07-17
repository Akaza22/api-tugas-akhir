import { Router } from 'express';
import { approveNews, checkExpiredApprovals, getApprovalsByNews, getPendingApprovals, rejectNews } from '../controllers/approvalController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();


router.get('/pending', authMiddleware, getPendingApprovals);         // ⬅️ pindah ke atas
router.get('/check-expiry', checkExpiredApprovals);
router.post('/:news_id/approve', authMiddleware, approveNews);
router.post('/:news_id/reject', authMiddleware, rejectNews);
router.get('/:news_id', authMiddleware, getApprovalsByNews);   


export default router;
