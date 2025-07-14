import { NewsApproval } from '../models';
import { users } from './seedUsers';
import { news } from './seedNews';

export const seedApprovals = async () => {
  await NewsApproval.bulkCreate([
    { news_id: news.news1.id, approver_id: users.supervisor1.id, weight: 50, note: 'Approved' },
    { news_id: news.news2.id, approver_id: users.supervisor2.id, weight: 30, note: 'Reviewed' },
  ]);

  console.log('✅ Approvals seeded');
};
