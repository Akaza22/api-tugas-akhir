import { Request, Response } from 'express';
import { controllerHandler } from '../utils/controllerHandler';
import { NewsApproval, NewsArticle, UserSupervisor } from '../models';
import { success, error } from '../utils/response';

export const approveNews = controllerHandler(async (req, res) => {
    const news_id = parseInt(req.params.news_id);
    const approver_id = req.user?.id;
  
    if (!approver_id) {
      res.status(401).json(error('Unauthorized'));
      return;
    }
  
    const existingApproval = await NewsApproval.findOne({
      where: { news_id, approver_id }
    });
  
    if (existingApproval) {
      res.status(409).json(error('Already approved this news', null, 409));
      return;
    }
  
    const relation = await UserSupervisor.findOne({
      where: {
        employee_id: req.body.author_id,
        supervisor_id: approver_id
      }
    });
  
    if (!relation) {
      res.status(403).json(error('You are not a supervisor for this author', null, 403));
      return;
    }
  
    const approval = await NewsApproval.create({
      news_id,
      approver_id,
      note: req.body.note || null,
      weight: relation.weight
    });
  
    const approvals = await NewsApproval.findAll({ where: { news_id } });
    const totalWeight = approvals.reduce((acc, a) => acc + a.weight, 0);
  
    if (totalWeight >= 100) {
      await NewsArticle.update({ status: 'approved' }, { where: { id: news_id } });
    }
  
    res.status(201).json(success('Approval submitted', { approval, totalWeight }, 201));
  });
  

export const getApprovalsByNews = controllerHandler(async (req, res) => {
  const news_id = parseInt(req.params.news_id);

  const approvals = await NewsApproval.findAll({
    where: { news_id },
    include: ['approver'] // pastikan model `NewsApproval` punya relasi ke User
  });

  const totalWeight = approvals.reduce((sum, item) => sum + item.weight, 0);

  res.json(success('Approval list', { approvals, totalWeight }));
});
