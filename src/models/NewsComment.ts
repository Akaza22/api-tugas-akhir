import {
    Table, Column, Model, DataType, ForeignKey, BelongsTo
  } from 'sequelize-typescript';
  import { User } from './User';
  import { NewsArticle } from './NewsArticle';
  
  @Table({ tableName: 'news_comments', timestamps: false })
  export class NewsComment extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;
  
    @ForeignKey(() => NewsArticle)
    @Column(DataType.INTEGER)
    news_id!: number;
  
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    user_id!: number;
  
    @Column(DataType.TEXT)
    comment!: string;
  
    @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
    created_at!: Date;
  
    @BelongsTo(() => NewsArticle)
    news!: NewsArticle;
  
    @BelongsTo(() => User)
    user!: User;
  }
  