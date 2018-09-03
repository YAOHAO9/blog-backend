import { Table, Column, Model, CreatedAt, UpdatedAt, BelongsTo, ForeignKey, DataType } from 'sequelize-typescript';
import Moment from './Moment.model';
import User from './User.model';
import Article from './Article.model';

@Table
export default class Discussion extends Model<Discussion> {

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User)
  public user: User;

  @Column
  public content: string;

  @Column(DataType.INTEGER)
  @ForeignKey(() => Moment)
  public momentId: number;

  @Column(DataType.INTEGER)
  @ForeignKey(() => Article)
  public articleId: number;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
