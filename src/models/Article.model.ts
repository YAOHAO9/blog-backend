import {
  Table, Column, Model, CreatedAt, UpdatedAt, DataType, BelongsTo, HasOne, ForeignKey, BelongsToMany,
} from 'sequelize-typescript';
import ArticleContent from './ArticleContent.model';
import User from './User.model';
import ArticleApprove from './ArticleApprove.model';
import ArticleDisapprove from './ArticleDisapprove.model';

@Table
export default class Article extends Model<Article> {

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User)
  public user: User;

  @Column(DataType.INTEGER)
  public icon: number;

  @Column
  public title: string;

  @Column
  public description: string;

  @HasOne(() => ArticleContent)
  public content: ArticleContent;

  @BelongsToMany(() => User, () => ArticleApprove)
  public approves: User[];

  @BelongsToMany(() => User, () => ArticleDisapprove)
  public disapproves: User[];

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
