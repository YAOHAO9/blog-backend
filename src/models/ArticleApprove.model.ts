import { Table, ForeignKey, Model, Column, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import Article from './Article.model';
import User from './User.model';

@Table
export default class ArticleApprove extends Model<ArticleApprove> {

    @ForeignKey(() => Article)
    @Column
    public articleId: number;

    @ForeignKey(() => User)
    @Column
    public authorId: number;

    @CreatedAt
    public createdAt: Date;

    @UpdatedAt
    public updatedAt: Date;
}
