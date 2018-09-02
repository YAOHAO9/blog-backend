import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, ForeignKey } from 'sequelize-typescript';
import Moment from './Moment.model';

@Table
export default class Archive extends Model<Archive> {

  @ForeignKey(() => Moment)
  @Column
  public momentId: number;

  @Column
  public fd: string;

  @Column(DataType.FLOAT)
  public size: number;

  @Column
  public type: string;

  @Column
  public filename: string;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
