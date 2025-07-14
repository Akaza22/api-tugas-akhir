import { controllerHandler } from '../utils/controllerHandler';
import { success } from '../utils/response';
import { User, NewsArticle, NewsComment, NewsApproval } from '../models';
import { Request, Response } from 'express';

export const getStatistics = controllerHandler(async (_req: Request, res: Response) => {
  const totalUsers = await User.count();
  const totalNews = await NewsArticle.count();
  const approvedNews = await NewsArticle.count({ where: { status: 'approved' } });
  const pendingNews = await NewsArticle.count({ where: { status: 'pending' } });
  const rejectedNews = await NewsArticle.count({ where: { status: 'rejected' } });

  const totalComments = await NewsComment.count();
  const totalApprovals = await NewsApproval.count();

  res.json(success('Statistics summary', {
    users: totalUsers,
    news: {
      total: totalNews,
      approved: approvedNews,
      pending: pendingNews,
      rejected: rejectedNews
    },
    comments: totalComments,
    approvals: totalApprovals
  }));
});
