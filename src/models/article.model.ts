import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, HasMany, BelongsTo, HasOne, ForeignKey } from 'sequelize-typescript';
import ArticleContent from './articlecontent.model';
import User from './user.model';

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

  @HasMany(() => User)
  approves: User[];

  @HasMany(() => User)
  disapproves: User[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
