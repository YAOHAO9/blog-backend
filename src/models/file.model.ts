import { Table, Column, Model, CreatedAt, UpdatedAt, DataType } from 'sequelize-typescript';

@Table
export default class File extends Model<File> {
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
