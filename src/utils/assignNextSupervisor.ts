import { NewsApproval, NewsArticle, UserSupervisor } from '../models';

export const assignNextSupervisor = async (news_id: number, current_approver_id: number) => {
  const news = await NewsArticle.findByPk(news_id);
  if (!news) return;

  const supervisors = await UserSupervisor.findAll({
    where: { employee_id: news.author_id },
    order: [['priority_order', 'ASC']]
  });

  const current = supervisors.find(s => s.supervisor_id === current_approver_id);
  if (!current) return;

  const next = supervisors.find(s => s.priority_order > current.priority_order);
  if (!next) return;

  const alreadyAssigned = await NewsApproval.findOne({
    where: {
      news_id,
      approver_id: next.supervisor_id
    }
  });

  if (!alreadyAssigned) {
    await NewsApproval.create({
      news_id,
      approver_id: next.supervisor_id,
      weight: next.weight,
      assigned_at: new Date()
    });

    console.log(`✅ Assigned next supervisor: ${next.supervisor_id}`);
  }
};
