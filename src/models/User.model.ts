import { Table, Column, Model, CreatedAt, UpdatedAt, IsEmail } from 'sequelize-typescript';

@Table
export default class User extends Model<User> {
  @Column
  public name: string;

  @Column
  public loginTimes: number;

  @Column
  public mmmmName: string;

  @Column
  public isAdmin: boolean;

  @IsEmail
  @Column
  public email: string;

  @Column
  public password: string;

  @Column
  public avator: number;

  @Column
  public socketId: string;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
