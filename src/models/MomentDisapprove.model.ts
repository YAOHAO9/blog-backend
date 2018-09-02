import { Table, ForeignKey, Model, Column, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import User from './User.model';
import Moment from './Moment.model';

@Table
export default class MomentDisapprove extends Model<MomentDisapprove> {

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
