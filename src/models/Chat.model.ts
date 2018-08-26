import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User.model';

@Table({ timestamps: true })
export default class Chat extends Model<Chat> {

  @Column
  session: string;

  @ForeignKey(() => User)
  @Column
  senderId: number;

  @BelongsTo(() => User)
  sender: User;

  @ForeignKey(() => User)
  @Column
  receiverId: number;

  @BelongsTo(() => User)
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
