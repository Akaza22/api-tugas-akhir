import {
    Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany
  } from 'sequelize-typescript';
  import { Role } from './Role';
  import { NewsArticle } from './NewsArticle';
  import { NewsApproval } from './NewsApproval';
  import { UserSupervisor } from './UserSupervisor';
  import { NewsComment } from './NewsComment';
  
  @Table({ tableName: 'users', timestamps: false })
  export class User extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;
  
    @Column(DataType.STRING)
    fullname!: string;
  
    @Column({ type: DataType.STRING, unique: true })
    email!: string;
  
    @Column({ type: DataType.STRING, unique: true })
    username!: string;
  
    @Column(DataType.STRING)
    password!: string;
    
    @Column(DataType.TEXT)
    avatar_url?: string;

    @ForeignKey(() => Role)
    @Column(DataType.INTEGER)
    role_id!: number;
  
    @BelongsTo(() => Role)
    role!: Role;
  
    @HasMany(() => NewsArticle)
    articles!: NewsArticle[];
  
    @HasMany(() => NewsApproval)
    approvals!: NewsApproval[];
  
    @HasMany(() => UserSupervisor, 'employee_id')
    subordinates!: UserSupervisor[];
  
    @HasMany(() => UserSupervisor, 'supervisor_id')
    supervisors!: UserSupervisor[];

    @HasMany(() => NewsComment)
    comments!: NewsComment[];
  }
  