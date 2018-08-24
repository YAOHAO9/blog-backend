import { Table, Column, Model, CreatedAt, UpdatedAt, IsEmail } from 'sequelize-typescript';

@Table
export default class User extends Model<User> {
  @Column
  name: string;

  @Column
  loginTimes: number;

  @Column
  memoName: string;

  @Column
  isAdmin: boolean;

  @IsEmail
  @Column
  email: string;

  @Column
  password: string;

  @Column
  avator: number;

  @Column
  socketId: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
