import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, ForeignKey } from 'sequelize-typescript';
import Moment from './Moment.model';

@Table
export default class Archive extends Model<Archive> {

  @ForeignKey(() => Moment)
  @Column
  public momentId: number;

  @Column
  public fieldname: string;

  @Column
  public originalname: string;

  @Column
  public encoding: string;

  @Column
  public mimetype: string;

  @Column
  public destination: string;

  @Column
  public filename: string;

  @Column
  public path: string;

  @Column(DataType.FLOAT)
  public size: number;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
