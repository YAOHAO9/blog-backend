import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, BelongsTo, HasOne, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import ArticleContent from './articlecontent.model';
import User from './user.model';
import ArticleApprove from './articleapprove.model';
import ArticleDisapprove from './articledisapprove.model';

@Table
export default class Article extends Model<Article> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column(DataType.INTEGER)
  icon: number;

  @Column
  title: string;

  @Column
  description: string;

  @HasOne(() => ArticleContent)
  content: ArticleContent;

  @BelongsToMany(() => User, () => ArticleApprove)
  approves: User[];

  @BelongsToMany(() => User, () => ArticleDisapprove)
  disapproves: User[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
