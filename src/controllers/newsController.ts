import { Request, Response } from 'express';
import { NewsArticle, User } from '../models';
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

  const author_id = req.user.id;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const bannerFile = files?.['banner']?.[0];
  const pdfFile = files?.['pdf']?.[0];

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
    pdf_url: pdfFile?.path || null,
    banner_url: bannerFile?.path || null,
    summary: null, // bisa diisi nanti oleh TextRank
    author_id
  });

  res.status(201).json(success('News created', news, 201));
});

export const updateNews = controllerHandler(async (req, res) => {
  const news = await NewsArticle.findByPk(req.params.id);
  if (!news) {
    res.status(404).json(error('News not found', null, 404));
    return;
  }

  const { title, content } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const bannerFile = files?.['banner']?.[0];
  const pdfFile = files?.['pdf']?.[0];


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
