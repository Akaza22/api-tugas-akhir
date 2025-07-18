import {
  Table, Column, Model, DataType, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import { User } from './User';
import { NewsArticle } from './NewsArticle';

@Table({ tableName: 'news_approvals', timestamps: false })
export class NewsApproval extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => NewsArticle)
  @Column(DataType.INTEGER)
  news_id!: number;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  approver_id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  weight!: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  note!: string;

  @Column({ type: DataType.DATE, defaultValue: null })
  approved_at!: Date;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  assigned_at!: Date;

  // ✅ Tambahkan alias yang konsisten dengan include di controller
  @BelongsTo(() => NewsArticle, { as: 'news' })
  news!: NewsArticle;

  @BelongsTo(() => User, {
    foreignKey: 'approver_id',
    as: 'approver', // <== Penting
  })
  approver!: User;
}
