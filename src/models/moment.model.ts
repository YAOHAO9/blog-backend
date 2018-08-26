import { Table, Column, Model, CreatedAt, UpdatedAt, HasMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import User from './user.model';
import File from './file.model';


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

  @HasMany(() => User)
  approves: User[];

  @HasMany(() => User)
  disapproves: User[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}