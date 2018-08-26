import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, ForeignKey } from 'sequelize-typescript';
import Moment from './Moment.model';

@Table({ timestamps: false })
export default class Archive extends Model<Archive> {

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
