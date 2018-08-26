import { Table, ForeignKey, Model, Column } from "sequelize-typescript";
import Article from "./article.model";
import User from "./user.model";

@Table
export default class ArticleApprove extends Model<ArticleApprove> {

    @ForeignKey(() => Article)
    @Column
    articleId: number;

    @ForeignKey(() => User)
    @Column
    authorId: number;
}