import { Request, Response } from 'express';
import { NewsArticle, User, UserSupervisor, NewsApproval } from '../models';
import { success, error } from '../utils/response';
import { controllerHandler } from '../utils/controllerHandler';
import { sequelize } from '../config/database';
import axios from 'axios';
import pdfParse from 'pdf-parse';
import { summarizePdfWithPython } from '../utils/pythonSummarizer';



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
  // 2. Mulai transaksi terkelola
  try {
    await sequelize.transaction(async (t) => {
      const { title, content } = req.body;

      if (!req.user) {
        // Kita lempar error agar transaksi di-rollback
        throw { status: 401, message: 'Unauthorized' };
      }

      const files = req.files as {
        banner?: Express.Multer.File[];
        pdf?: Express.Multer.File[];
      };
      const bannerFile = files.banner?.[0];
      const pdfFile = files.pdf?.[0];

      // Validasi file...
      if (bannerFile && !['image/jpeg', 'image/png'].includes(bannerFile.mimetype)) {
        throw { status: 400, message: 'Invalid banner format. Only JPG/PNG allowed.' };
      }
      if (pdfFile && pdfFile.mimetype !== 'application/pdf') {
        throw { status: 400, message: 'Invalid file format. Only PDF allowed.' };
      }

      let summary: string | null = null;
      if (pdfFile?.path) {
        const pdfUrl = pdfFile.path;

        // coba pakai python textrank
        summary = await summarizePdfWithPython(pdfUrl, 5);

        // fallback JS sederhana kalau gagal
        if (!summary) {
          try {
            const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
            const pdfBuffer = response.data;
            const parsed = await pdfParse(pdfBuffer);
            const fullText = parsed.text ?? '';
            const sentences = fullText
              .split(/[.!?]/g)
              .map((s: string) => s.trim())
              .filter(Boolean);
            summary = sentences.slice(0, 3).join('. ') + '.';
          } catch (err) {
            console.warn('Fallback summary failed:', err);
            summary = null;
          }
        }
      }



      // 3. Gunakan transaksi (t) untuk setiap operasi database
      const news = await NewsArticle.create({
        title,
        content: content || null,
        pdf_url: pdfFile?.path ?? null,
        banner_url: bannerFile?.path ?? null,
        summary: summary,
        author_id: req.user.id
      }, { transaction: t });

      const supervisors = await UserSupervisor.findAll({
        where: { employee_id: req.user.id },
        order: [['priority_order', 'ASC']],
        transaction: t // Gunakan transaksi di sini juga
      });

      if (supervisors.length > 0) {
        const approvalsToCreate = supervisors.map(s => ({
          news_id: news.id,
          approver_id: s.supervisor_id,
          weight: s.weight,
          assigned_at: new Date()
        }));

        await NewsApproval.bulkCreate(approvalsToCreate, { transaction: t });
      }

      // 4. Kirim respons HANYA SETELAH transaksi berhasil
      // Jika kita sampai di sini, artinya semua operasi di atas berhasil.
      // Sequelize akan otomatis melakukan COMMIT saat blok ini selesai.
      res.status(201).json(success('News created', news));
    });
  } catch (err: any) {
    // Menangkap error yang kita lempar (throw) atau error database lainnya
    console.error("TRANSACTION FAILED:", err);
    res.status(err.status || 500).json(error(err.message || 'Internal Server Error'));
  }
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

  news.status = 'pending';
  await news.save();

  await NewsApproval.destroy({ where: { news_id } });

  const supervisors = await UserSupervisor.findAll({
    where: { employee_id: user_id },
    order: [['priority_order', 'ASC']]
  });

  if (supervisors.length > 0) {
    const approvalsToCreate = supervisors.map(s => ({
      news_id,
      approver_id: s.supervisor_id,
      weight: s.weight,
      assigned_at: new Date()
    }));
    await NewsApproval.bulkCreate(approvalsToCreate);
  }

  res.json(success('News revised and resubmitted')); // ✅ No return
});


