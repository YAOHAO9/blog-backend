import { Table, Column, Model, CreatedAt, UpdatedAt, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import Moment from './Moment.model';
import User from './User.model';
import Article from './Article.model';

@Table
export default class Comment extends Model<Comment> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  content: string;

  @Column(DataType.INTEGER)
  @ForeignKey(() => Moment)
  moment: number;

  @Column(DataType.INTEGER)
  @ForeignKey(() => Article)
  article: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
