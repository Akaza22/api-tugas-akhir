import { NewsArticle } from '../models';
import { users } from './seedUsers';

export let news: Record<string, any> = {};

export const seedNews = async () => {
  news.news1 = await NewsArticle.create({
    title: 'News from Reporter 1',
    content: 'Test content 1',
    author_id: users.reporter1.id,
    status: 'approved',
  });

  news.news2 = await NewsArticle.create({
    title: 'News from Reporter 2',
    content: 'Test content 2',
    author_id: users.reporter2.id,
    status: 'pending',
  });

  console.log('✅ News seeded');
};
