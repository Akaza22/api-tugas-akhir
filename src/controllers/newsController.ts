import { Request, Response } from 'express';
import { NewsArticle, User, UserSupervisor, NewsApproval } from '../models';
import { success, error } from '../utils/response';
import { controllerHandler } from '../utils/controllerHandler';

export const getAllNews = controllerHandler(async (_req, res) => {
  const news = await NewsArticle.findAll({ include: [User] });
  res.json(success('List of news', news));
});

export const getNewsById = controllerHandler(async (req, res) => {
  const news = await NewsArticle.findByPk(req.params.id, { include: [User] });
  if (!news) {
    res.status(404).json(error('News not found', null, 404));
    return;
  }
  res.json(success('News detail', news));
});

export const createNews = controllerHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!req.user) {
    res.status(401).json(error('Unauthorized', null, 401));
    return;
  }

  const files = req.files as {
    banner?: Express.Multer.File[];
    pdf?: Express.Multer.File[];
  };
  const bannerFile = files.banner?.[0];
  const pdfFile = files.pdf?.[0];

  if (bannerFile && !['image/jpeg', 'image/png'].includes(bannerFile.mimetype)) {
    res.status(400).json(error('Invalid banner format. Only JPG/PNG allowed.'));
    return;
  }

  if (pdfFile && pdfFile.mimetype !== 'application/pdf') {
    res.status(400).json(error('Invalid file format. Only PDF allowed.'));
    return;
  }

  const news = await NewsArticle.create({
    title,
    content: content || null,
    pdf_url: pdfFile?.path ?? null,
    banner_url: bannerFile?.path ?? null,
    summary: null,
    author_id: req.user.id
  });

    // 🔥 Tambahan: assign supervisor dengan priority_order = 1
  const supervisors = await UserSupervisor.findAll({
    where: { employee_id: req.user.id },
    order: [['priority_order', 'ASC']]
  });

  if (supervisors.length > 0) {
    const main = supervisors[0];
    await NewsApproval.create({
      news_id: news.id,
      approver_id: main.supervisor_id,
      weight: main.weight,
      assigned_at: new Date() // ini wajib agar bisa dicek nanti 24 jam
    });
  }

  res.status(201).json(success('News created', news));
});


export const updateNews = controllerHandler(async (req, res) => {
  const news = await NewsArticle.findByPk(req.params.id);
  if (!news) {
    res.status(404).json(error('News not found', null, 404));
    return;
  }

  const { title, content } = req.body;

  const files = req.files as {
    banner?: Express.Multer.File[];
    pdf?: Express.Multer.File[];
  };
  const bannerFile = files.banner?.[0];
  const pdfFile = files.pdf?.[0];

  if (bannerFile && !['image/jpeg', 'image/png'].includes(bannerFile.mimetype)) {
    res.status(400).json(error('Invalid banner format. Only JPG/PNG allowed.'));
    return;
  }

  if (pdfFile && pdfFile.mimetype !== 'application/pdf') {
    res.status(400).json(error('Invalid file format. Only PDF allowed.'));
    return;
  }

  await news.update({
    title: title ?? news.title,
    content: content ?? news.content,
    pdf_url: pdfFile?.path ?? news.pdf_url,
    banner_url: bannerFile?.path ?? news.banner_url
  });

  res.json(success('News updated', news));
});

export const deleteNews = controllerHandler(async (req, res) => {
  const news = await NewsArticle.findByPk(req.params.id);
  if (!news) {
    res.status(404).json(error('News not found', null, 404));
    return;
  }
  await news.destroy();
  res.json(success('News deleted'));
});

export const reviseNews = controllerHandler(async (req: Request, res: Response) => {
  const news_id = parseInt(req.params.id);
  const user_id = req.user?.id;

  const news = await NewsArticle.findByPk(news_id);
  if (!news) {
    res.status(404).json(error('News not found', null, 404));
    return;
  }

  if (news.author_id !== user_id) {
    res.status(403).json(error('Only the author can revise this news'));
    return;
  }

  if (news.status !== 'rejected') {
    res.status(400).json(error('Only rejected news can be revised'));
    return;
  }

  // Reset status
  news.status = 'pending';
  await news.save();

  // Hapus semua approval lama
  await NewsApproval.destroy({ where: { news_id } });

  // Assign ulang ke supervisor utama
  const supervisors = await UserSupervisor.findAll({
    where: { employee_id: user_id },
    order: [['priority_order', 'ASC']]
  });

  if (supervisors.length > 0) {
    const main = supervisors[0];
    await NewsApproval.create({
      news_id,
      approver_id: main.supervisor_id,
      weight: main.weight,
      assigned_at: new Date()
    });
  }

  res.json(success('News revised and resubmitted'));
});
