import { Table, ForeignKey, Model, Column, CreatedAt, UpdatedAt } from "sequelize-typescript";
import Article from "./Article.model";
import User from "./User.model";

@Table({ timestamps: true })
export default class ArticleDisapprove extends Model<ArticleDisapprove> {

    @ForeignKey(() => Article)
    @Column
    articleId: number;

    @ForeignKey(() => User)
    @Column
    authorId: number;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}