import { Table, ForeignKey, Model, Column, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import User from './User.model';
import Moment from './Moment.model';

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

    @UpdatedAt
    public updatedAt: Date;
}
