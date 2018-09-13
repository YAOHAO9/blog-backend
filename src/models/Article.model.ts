import {
  Table, Column, Model, CreatedAt, UpdatedAt, DataType, BelongsTo, HasOne, ForeignKey, HasMany, Default,
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

  @Default([])
  @Column(DataType.ARRAY(DataType.INTEGER))
  public approves: number[];

  @Default([])
  @Column(DataType.ARRAY(DataType.INTEGER))
  public disapproves: number[];

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
