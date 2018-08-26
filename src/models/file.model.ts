import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, ForeignKey } from 'sequelize-typescript';
import Moment from './moment.model';

@Table
export default class File extends Model<File> {

  @ForeignKey(() => Moment)
  @Column
  momentId: number;

  @Column
  fd: string;

  @Column(DataType.FLOAT)
  size: number;

  @Column
  type: string;

  @Column
  filename: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
