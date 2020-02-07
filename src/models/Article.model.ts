import {
  Table, Column, Model, CreatedAt, UpdatedAt, DataType, BelongsTo, HasOne, ForeignKey, HasMany,
} from 'sequelize-typescript';
import ArticleContent from './ArticleContent.model';
import User from './User.model';
import Discussion from './Discussion.model';

@Table
export default class Article extends Model<Article>   {

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User, 'userId')
  public user: User;

  @Column(DataType.INTEGER)
  public icon: number;

  @Column
  public title: string;

  @Column
  public description: string;

  @Column
  public type: string;

  @HasOne(() => ArticleContent)
  public content: ArticleContent;

  @HasMany(() => Discussion)
  public discussions: Discussion[];

  public approves: User[];

  public disapproves: User[];

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
