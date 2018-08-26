import { Table, Column, Model, CreatedAt, UpdatedAt, HasMany, BelongsTo, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import User from './User.model';
import Archive from './Archive.model';
import MomentApprove from './MomentApprove.model';
import MomentDisapprove from './MomentDisapprove.model';


@Table({ timestamps: true })
export default class Moment extends Model<Moment> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Archive)
  images: Archive[];

  @Column
  content: string;

  @Column
  city: string;

  @Column
  ip: string;

  @BelongsToMany(() => User, () => MomentApprove)
  approves: User[];

  @BelongsToMany(() => User, () => MomentDisapprove)
  disapproves: User[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}