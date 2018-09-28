import {
  Table, Column, Model, CreatedAt, UpdatedAt, DataType, ForeignKey, BelongsTo, Default, AllowNull,
} from 'sequelize-typescript';
import User from './User.model';

export enum ChatType {
  TEXT = 'text',
  IMAGE = 'image',
}

@Table
export default class Chat extends Model<Chat> {

  @Column
  public session: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  public senderId: number;

  @BelongsTo(() => User, { foreignKey: 'senderId', targetKey: 'id' })
  public sender: User;

  @ForeignKey(() => User)
  @Column
  public receiverId: number;

  @BelongsTo(() => User, { foreignKey: 'receiverId', targetKey: 'id' })
  public receiver: User;

  @AllowNull(false)
  @Column
  public type: string;

  @Column(DataType.TEXT)
  public content: string;

  @Column
  public img: string;

  @Default(false)
  @Column
  public read: boolean;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
