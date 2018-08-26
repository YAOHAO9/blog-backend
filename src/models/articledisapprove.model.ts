import { Table, ForeignKey, Model, Column } from "sequelize-typescript";
import Article from "./article.model";
import User from "./user.model";

@Table
export default class ArticleDisapprove extends Model<ArticleDisapprove> {

    @ForeignKey(() => Article)
    @Column
    articleId: number;

    @ForeignKey(() => User)
    @Column
    authorId: number;
}