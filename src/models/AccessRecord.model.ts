import { Table, Column, Model, CreatedAt, UpdatedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User.model';

@Table
export default class AccessRecord extends Model<AccessRecord> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

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
