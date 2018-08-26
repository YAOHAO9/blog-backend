import { Table, ForeignKey, Model, Column, CreatedAt, UpdatedAt } from "sequelize-typescript";
import User from "./User.model";
import Moment from "./Moment.model";

@Table({ timestamps: false })
export default class MomentApprove extends Model<MomentApprove> {

    @ForeignKey(() => Moment)
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