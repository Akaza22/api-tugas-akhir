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
  
    @Column(DataType.TEXT)
    note!: string;
  
    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    approved_at!: Date;

    @Column({ type: DataType.DATE, defaultValue: DataType.NOW }) // ✅ Tambahan baru
    assigned_at!: Date;
  
    @BelongsTo(() => NewsArticle)
    news!: NewsArticle;
  
    @BelongsTo(() => User, 'approver_id')
    approver!: User;
  }
  