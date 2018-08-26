import { Table, Column, Model, CreatedAt, UpdatedAt, DataType, ForeignKey } from 'sequelize-typescript';
import Article from './Article.model';

@Table({ timestamps: false })
export default class ArticleContent extends Model<ArticleContent> {

  @ForeignKey(() => Article)
  @Column
  articleId: number;

  @Column(DataType.TEXT)
  content: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
