import { Request, Response } from 'express';
import { controllerHandler } from '../utils/controllerHandler';
import { NewsApproval, NewsArticle, UserSupervisor, User } from '../models';
import { success, error } from '../utils/response';
import { Op } from 'sequelize';

export const approveNews = controllerHandler(async (req, res) => {
  const news_id = parseInt(req.params.news_id);
  const approver_id = req.user?.id;

  if (!approver_id) {
    res.status(401).json(error('Unauthorized'));
    return;
  }

  // ✅ Cek apakah user punya hak approval AKTIF
  const approval = await NewsApproval.findOne({
    where: {
      news_id,
      approver_id,
      approved_at: null
    }
  });

  if (!approval) {
    res.status(403).json(error('You are not currently assigned to approve this news'));
    return;
  }

  // ✅ Tandai approved sekarang
  approval.approved_at = new Date();
  approval.note = req.body.note || null;
  await approval.save();

  // ✅ Hitung total bobot
  const allApprovals = await NewsApproval.findAll({
    where: { news_id, approved_at: { [Op.ne]: null } }
  });

  const totalWeight = allApprovals.reduce((sum, a) => sum + a.weight, 0);

  // ✅ Ubah status berita jika bobot cukup
  if (totalWeight >= 100) {
    await NewsArticle.update({ status: 'approved' }, { where: { id: news_id } });
  }

  res.status(201).json(success('Approval submitted', { approval, totalWeight }, 201));
});
  

export const getApprovalsByNews = controllerHandler(async (req, res) => {
  const news_id = parseInt(req.params.news_id);

  const approvals = await NewsApproval.findAll({
    where: { news_id },
    include: ['approver']
  });

  const totalWeight = approvals
    .filter(a => a.approved_at)
    .reduce((sum, item) => sum + item.weight, 0);

  const reasons = approvals
    .filter(a => a.note && ['revisi', 'reject'].some(keyword => a.note.toLowerCase().includes(keyword)))
    .map(a => ({ by: a.approver_id, note: a.note }));

  res.json(success('Approval list', { approvals, totalWeight, reasons }));
});



export const rejectNews = controllerHandler(async (req, res) => {
  const news_id = parseInt(req.params.news_id);
  const approver_id = req.user?.id;

  if (!approver_id) {
    res.status(401).json(error('Unauthorized'));
    return;
  }

  const approval = await NewsApproval.findOne({
    where: { news_id, approver_id, approved_at: null }
  });

  if (!approval) {
    res.status(403).json(error('You are not currently assigned to approve this news'));
    return;
  }

  const note = req.body.note?.trim();
  if (!note) {
    res.status(400).json(error('Rejection note is required'));
    return;
  }

  approval.approved_at = new Date();
  approval.note = note;
  await approval.save();

  await NewsArticle.update({ status: 'rejected' }, { where: { id: news_id } });

  res.status(200).json(success('News rejected with reason', approval));
});


export const checkExpiredApprovals = controllerHandler(async (_req, res) => {
  const expiredApprovals = await NewsApproval.findAll({
    where: {
      approved_at: null,
      assigned_at: {
        [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000) // lebih dari 24 jam
      }
    }
  });

  let updated = 0;

  for (const approval of expiredApprovals) {
    const news = await NewsArticle.findByPk(approval.news_id);
    if (!news) continue;

    const supervisors = await UserSupervisor.findAll({
      where: { employee_id: news.author_id },
      order: [['priority_order', 'ASC']]
    });

    const current = supervisors.find(s => s.supervisor_id === approval.approver_id);
    if (!current) continue;

    const next = supervisors.find(s => s.priority_order > current.priority_order);
    if (!next) continue;

    const alreadyAssigned = await NewsApproval.findOne({
      where: {
        news_id: news.id,
        approver_id: next.supervisor_id
      }
    });
    if (alreadyAssigned) continue;

    await NewsApproval.create({
      news_id: news.id,
      approver_id: next.supervisor_id,
      weight: next.weight,
      assigned_at: new Date()
    });

    updated++;
  }

  res.json(success('Expired approvals processed', { updated }));
});

export const getPendingApprovals = controllerHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json(error('Unauthorized'));
      return;
    } 

    // Ambil berita yang belum sepenuhnya disetujui (total bobot < 100)
    const pending = await NewsArticle.findAll({
      include: [
        {
          model: NewsApproval,
          attributes: ['approver_id', 'weight']
        },
        {
          model: User,
          as: 'author',
          attributes: ['fullname']
        }
      ]
    });

    // Hitung total bobot approval
    const filtered = pending.filter((news) => {
      const total = news.approvals.reduce((acc, curr) => acc + curr.weight, 0);
      return total < 100;
    });

    res.json(success('Pending approvals fetched', filtered));
  } catch (err) {
    console.error(err);
    res.status(500).json(error('Failed to fetch pending approvals', err));
  }
});
