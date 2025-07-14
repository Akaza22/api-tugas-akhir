import { Request, Response } from 'express';
import { NewsComment, NewsArticle, User } from '../models';
import { success, error } from '../utils/response';
import { controllerHandler } from '../utils/controllerHandler';

export const getComments = controllerHandler(async (req, res) => {
  const news_id = parseInt(req.params.news_id);

  const news = await NewsArticle.findByPk(news_id);
  if (!news) {
    res.status(404).json(error('News not found', null, 404));
    return;
  }

  const comments = await NewsComment.findAll({
    where: { news_id },
    include: [{ model: User, attributes: ['id', 'fullname', 'username'] }],
    order: [['created_at', 'ASC']]
  });

  res.json(success('Comments fetched', comments));
});

export const postComment = controllerHandler(async (req, res) => {
  const user_id = req.user?.id;
  const news_id = parseInt(req.params.news_id);
  const { comment } = req.body;

  if (!user_id) {
    res.status(401).json(error('Unauthorized', null, 401));
    return;
  }

  if (!comment || comment.trim() === '') {
    res.status(400).json(error('Comment cannot be empty', null, 400));
    return;
  }

  const news = await NewsArticle.findByPk(news_id);
  if (!news) {
    res.status(404).json(error('News not found', null, 404));
    return;
  }

  const newComment = await NewsComment.create({ news_id, user_id, comment });

  res.status(201).json(success('Comment posted', newComment, 201));
});

export const deleteComment = controllerHandler(async (req, res) => {
  const comment_id = parseInt(req.params.id);
  const user = req.user;

  const comment = await NewsComment.findByPk(comment_id);

  if (!comment) {
    res.status(404).json(error('Comment not found', null, 404));
    return;
  }

  // Only allow if admin or the comment owner
  if (user?.id !== comment.user_id && user?.role?.name !== 'admin') {
    res.status(403).json(error('Forbidden', null, 403));
    return;
  }

  await comment.destroy();
  res.json(success('Comment deleted'));
});
