import { Table, ForeignKey, Model, Column, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import Article from './Article.model';
import User from './User.model';

export enum ApproveStatus {
    Approve = 1,
    Disapprove = 2,
}

@Table
export default class ArticleApprove extends Model<ArticleApprove> {

    @ForeignKey(() => Article)
    @Column
    public articleId: number;

    @ForeignKey(() => User)
    @Column
    public authorId: number;

    @Column
    public status: ApproveStatus;

    @CreatedAt
    public createdAt: Date;

    @UpdatedAt
    public updatedAt: Date;
}
