import { Table, ForeignKey, Model, Column } from "sequelize-typescript";
import User from "./user.model";
import Moment from "./moment.model";

@Table
export default class MomentDisapprove extends Model<MomentDisapprove> {

    @ForeignKey(() => Moment)
    @Column
    articleId: number;

    @ForeignKey(() => User)
    @Column
    authorId: number;
}