import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, ForeignKey } from 'sequelize-typescript';
import Article from './Article.model';

@Table
export default class ArticleContent extends Model<ArticleContent> {

  @ForeignKey(() => Article)
  @Column
  public articleId: number;

  @Column(DataType.TEXT)
  public content: string;

  @CreatedAt
  public createdAt: Date;

  @UpdatedAt
  public updatedAt: Date;
}
