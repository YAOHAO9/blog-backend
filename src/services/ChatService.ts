import { sequelize } from './SequelizeService';

export const getChatUserList = async (userId: number, offset: number = 0, limit: number = 10) => {
    // tslint:disable-next-line:max-line-length
    const [usersInfo] = await sequelize.query(`SELECT id as "userId", MAX("loginTimes") "loginTimes", MAX("updatedAt") "updatedAt" FROM (SELECT u.id, u."loginTimes", c."updatedAt" FROM "User" u LEFT JOIN (SELECT * FROM "Chat" WHERE "senderId"=${userId} OR "receiverId"=${userId} ) c ON u.id=c."senderId" OR u.id=c."receiverId") as uid WHERE id != ${userId} GROUP BY id  ORDER BY MAX("updatedAt") DESC NULLS LAST, MAX("loginTimes") DESC OFFSET ${offset} LIMIT ${limit}`);
    console.log(JSON.stringify(usersInfo));
    const userIds = usersInfo.map((userInfo) => userInfo.userId);
    // tslint:disable-next-line:max-line-length
    const [users] = await sequelize.query(`SELECT *, (SELECT COUNT(*) FROM "Chat" WHERE (("senderId"=${userId} AND "receiverId"=u.id) OR ("senderId"=u.id AND "receiverId"=${userId})) AND read=false ) "unreadCount" FROM "User" u WHERE id in (${userIds.join(',')})`);
    return users;
};
