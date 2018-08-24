import { Table, Column, Model, CreatedAt, UpdatedAt, DataType } from 'sequelize-typescript';

@Table
export default class ArticleContent extends Model<ArticleContent> {

  @Column(DataType.TEXT)
  content: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
