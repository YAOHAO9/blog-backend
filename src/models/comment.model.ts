import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, ForeignKey } from 'sequelize-typescript';
import Moment from './moment.model';
import User from './user.model';
import Article from './article.model';

@Table
export default class Comment extends Model<Comment> {
  @Column(DataType.INTEGER)
  @ForeignKey(() => User)
  user: number;

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
