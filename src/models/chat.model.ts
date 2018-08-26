import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, HasOne } from 'sequelize-typescript';
import User from './user.model';

@Table
export default class Chat extends Model<Chat> {

  @Column
  session: string;

  @HasOne(() => User)
  sender: User;

  @HasOne(() => User)
  receiver: User;

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
