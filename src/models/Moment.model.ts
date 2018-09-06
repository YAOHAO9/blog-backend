import {
  Table, Column, Model, CreatedAt, UpdatedAt, HasMany, BelongsTo, ForeignKey, BelongsToMany,
} from 'sequelize-typescript';
import User from './User.model';
import Archive from './Archive.model';
import MomentApprove from './MomentApprove.model';
import MomentDisapprove from './MomentDisapprove.model';

export interface MomentMethod extends Moment {
  getUser: () => User;
  getDisapproves: () => User[];
  getApproves: () => User[];
}

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

  @BelongsToMany(() => User, () => MomentApprove)
  public approves: User[];

  @BelongsToMany(() => User, () => MomentDisapprove)
  public disapproves: User[];

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
