import {
  Table, Column, Model, CreatedAt, UpdatedAt, HasMany, BelongsTo, ForeignKey, DataType, Default,
} from 'sequelize-typescript';
import User from './User.model';
import Archive from './Archive.model';
import Discussion from './Discussion.model';

@Table
export default class Moment extends Model<Moment> {

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User)
  public user: User;

  @HasMany(() => Archive)
  public images: Archive[];

  @Column
  public content: string;

  @Column
  public city: string;

  @Column
  public ip: string;

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
