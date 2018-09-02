import { Table, ForeignKey, Model, Column, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import User from './User.model';
import Moment from './Moment.model';

@Table
export default class MomentApprove extends Model<MomentApprove> {

    @ForeignKey(() => Moment)
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
