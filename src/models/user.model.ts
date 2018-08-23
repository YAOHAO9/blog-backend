import { Table, Column, Model, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript';

@Table
export default class User extends Model<User> {

    @Column
    nickname: string;

    @Column
    heihei: string;
    @CreatedAt
    createdAt: Date;
    @UpdatedAt
    updatedAt: Date;
    @DeletedAt
    deletedAt: Date;
}
