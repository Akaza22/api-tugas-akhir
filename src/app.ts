import express from 'express';
import authRoutes from './routes/authRoutes';
import roleRoutes from './routes/roleRoutes';
import userRoutes from './routes/userRoutes';
import approvalRoutes from './routes/approvalRoutes';
import newsRoutes from './routes/newsRoutes';
import commentRoutes from './routes/commentRoutes';
import supervisorRoutes from './routes/supervisorRoutes';
import profileRoutes from './routes/profileRoutes';
import statisticsRoutes from './routes/statisticsRoutes';

import cors from 'cors';

const app = express();

app.use(cors());
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/supervisors', supervisorRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/stats', statisticsRoutes);

export default app;
