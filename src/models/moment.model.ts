import { Table, Column, Model, CreatedAt, UpdatedAt, HasMany, BelongsTo, ForeignKey, BelongsToMany } from 'sequelize-typescript';
import User from './user.model';
import File from './file.model';
import MomentApprove from './momentapprove.model';
import MomentDisapprove from './momentdisapprove.model';


@Table
export default class Moment extends Model<Moment> {

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => File)
  images: File[];

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