import { Table, Column, Model, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import User from './User.model';

@Table
export default class AccessRecord extends Model<AccessRecord> {

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User, 'userId')
  public user: User;

  @Column
  public ip: string;

  @Column
  public url: string;

  @Column
  public method: string;

  @Column
  public params: string;

  @Column
  public body: string;

  @Column
  public location: string;

  @Column
  public date: Date;

  @CreatedAt
  @Column(DataType.DATE)
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
