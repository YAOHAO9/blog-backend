import { Table, ForeignKey, Model, Column, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import User from './User.model';
import Moment from './Moment.model';

export enum ApproveStatus {
    Approve = 1,
    Disapprove = 2,
}
@Table
export default class MomentApprove extends Model<MomentApprove> {

    @ForeignKey(() => Moment)
    @Column
    public momentId: number;

    @ForeignKey(() => User)
    @Column
    public userId: number;

    @CreatedAt
    public createdAt: Date;

    @Column
    public status: ApproveStatus;

    @UpdatedAt
    public updatedAt: Date;
}
