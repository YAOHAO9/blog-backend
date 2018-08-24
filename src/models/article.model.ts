import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, ForeignKey, HasMany } from 'sequelize-typescript';
import ArticleContent from './articlecontent.model';
import User from './user.model';

@Table
export default class Article extends Model<Article> {

  @Column(DataType.INTEGER)
  @ForeignKey(() => User)
  user: number;

  @Column(DataType.INTEGER)
  icon: number;

  @Column
  title: string;

  @Column
  description: string;

  @Column(DataType.INTEGER)
  @ForeignKey(() => ArticleContent)
  content: number;

  @HasMany(() => User)
  approves: User[];

  @HasMany(() => User)
  disapproves: User[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
