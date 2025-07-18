import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany
} from 'sequelize-typescript';
import { User } from './User';
import { NewsApproval } from './NewsApproval';
import { NewsComment } from './NewsComment';

@Table({ tableName: 'news_articles', timestamps: false })
export class NewsArticle extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  content?: string; // Optional if user uploads PDF

  @Column(DataType.TEXT)
  summary?: string; // Generated by TextRank

  @Column(DataType.TEXT)
  banner_url?: string; // Path to uploaded image

  @Column(DataType.TEXT)
  pdf_url?: string; // Path to uploaded PDF

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  author_id!: number;

  @BelongsTo(() => User)
  author!: User;

  @Column({ type: DataType.STRING, defaultValue: 'pending' })
  status!: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  created_at!: Date;

  @HasMany(() => NewsApproval, { foreignKey: 'news_id', as: 'approvals' })
  approvals!: NewsApproval[];

  @HasMany(() => NewsComment, { foreignKey: 'news_id', as: 'comments' })
  comments!: NewsComment[];
}
