import { NewsApproval } from '../models';
import { users } from './seedUsers';
import { news } from './seedNews';

export const seedApprovals = async () => {
  await NewsApproval.bulkCreate([
    {
      news_id: news.news1.id,
      approver_id: users.supervisor1.id,
      weight: 60,
      assigned_at: new Date()
    },
    {
      news_id: news.news2.id,
      approver_id: users.supervisor2.id,
      weight: 50,
      assigned_at: new Date()
    }
  ]);

  console.log('✅ Initial approvals seeded (only supervisor 1)');
};
