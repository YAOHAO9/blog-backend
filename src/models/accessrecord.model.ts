import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, ForeignKey } from 'sequelize-typescript';
import User from './user.model';

@Table
export default class AccessRecord extends Model<AccessRecord> {

  @Column(DataType.INTEGER)
  @ForeignKey(() => User)
  user: number;

  @Column
  ip: string;

  @Column
  url: string;

  @Column
  method: string;

  @Column
  params: string;

  @Column
  body: string;

  @Column
  location: string;

  @Column
  date: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
