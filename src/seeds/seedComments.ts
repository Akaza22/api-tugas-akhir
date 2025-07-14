import { NewsComment } from '../models';
import { users } from './seedUsers';
import { news } from './seedNews';

export const seedComments = async () => {
  await NewsComment.bulkCreate([
    { news_id: news.news1.id, user_id: users.supervisor1.id, comment: 'Good work' },
    { news_id: news.news1.id, user_id: users.admin.id, comment: 'Needs edit' },
    { news_id: news.news2.id, user_id: users.supervisor2.id, comment: 'Nice article' },
  ]);

  console.log('✅ Comments seeded');
};
