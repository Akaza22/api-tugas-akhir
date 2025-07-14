import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'roles', timestamps: false })
export class Role extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  name!: string;
}
