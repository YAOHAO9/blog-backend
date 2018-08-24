import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, ForeignKey } from 'sequelize-typescript';
import User from './user.model';

@Table
export default class Chat extends Model<Chat> {

  @Column
  session: string;

  @Column(DataType.INTEGER)
  @ForeignKey(() => User)
  sender: number;

  @Column(DataType.INTEGER)
  @ForeignKey(() => User)
  receiver: number;

  @Column
  type: string;

  @Column(DataType.TEXT)
  content: string;

  @Column
  img: string;

  @Column
  read: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
