import {
    Table, Column, Model, DataType, ForeignKey, BelongsTo
  } from 'sequelize-typescript';
  import { User } from './User';
  
  @Table({ tableName: 'user_supervisors', timestamps: false })
  export class UserSupervisor extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id!: number;
  
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    employee_id!: number;
  
    @ForeignKey(() => User)
    @Column(DataType.INTEGER)
    supervisor_id!: number;
  
    @Column({ type: DataType.INTEGER, allowNull: false })
    weight!: number;

    @Column({ type: DataType.INTEGER, defaultValue: 1 })
    priority_order!: number; 
  
    @BelongsTo(() => User, 'employee_id')
    employee!: User;
  
    @BelongsTo(() => User, 'supervisor_id')
    supervisor!: User;
  }
  