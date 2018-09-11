import { Sequelize } from 'sequelize-typescript';
import AccessRecord from './AccessRecord.model';
import Config from '../config';
import Archive from './Archive.model';
import Article from './Article.model';
import ArticleApprove from './ArticleApprove.model';
import ArticleDisapprove from './ArticleDisapprove.model';
import Chat from './Chat.model';
import Discussion from './Discussion.model';
import MomentApprove from './MomentApprove.model';
import Moment from './Moment.model';
import MomentDisapprove from './MomentDisapprove.model';
import User from './User.model';

const Op = Sequelize.Op;
const operatorsAliases = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $in: Op.in,
    $notIn: Op.notIn,
    $is: Op.is,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
    $and: Op.and,
    $or: Op.or,
    $any: Op.any,
    $all: Op.all,
    $values: Op.values,
    $col: Op.col,
};

export const sequelize = new Sequelize(Object.assign(Config.sequelize, { operatorsAliases }));

export const initializeSequelize = async () => {
    await sequelize.validate();
    await AccessRecord.sync({ alter: true });
    await Archive.sync({ alter: true });
    await Article.sync({ alter: true });
    await ArticleApprove.sync({ alter: true });
    await ArticleDisapprove.sync({ alter: true });
    await Chat.sync({ alter: true });
    await Discussion.sync({ alter: true });
    await Moment.sync({ alter: true });
    await MomentApprove.sync({ alter: true });
    await MomentDisapprove.sync({ alter: true });
    await User.sync({ alter: true });
};
