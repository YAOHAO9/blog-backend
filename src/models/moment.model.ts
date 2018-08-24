import { Table, Column, Model, CreatedAt, UpdatedAt, ForeignKey, HasMany } from 'sequelize-typescript';
import User from './user.model';
import File from './file.model';


@Table
export default class Moment extends Model<Moment> {

  @Column
  @ForeignKey(() => User)
  user: number;

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