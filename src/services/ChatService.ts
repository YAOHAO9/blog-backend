import { sequelize } from './SequelizeService';

export const getChatUserList = async (userId: number, offset: number = 0, limit: number = 10, exclude = '') => {
    const excludeIds = [userId, ...(exclude ? exclude.split(',') : [])];
    // tslint:disable-next-line:max-line-length
    const [usersInfo] = await sequelize.query(`SELECT * FROM (SELECT *, (SELECT COUNT(*) FROM "Chat" WHERE (("senderId"=u.id AND "receiverId"=${userId})) AND read=false ) "unreadCount" FROM (SELECT id as "userId", MAX("loginTimes") "loginTimes", MAX("updatedAt") "latestChatAt", COUNT(id) "chatCount" FROM (SELECT u.id, u."loginTimes", c."updatedAt" FROM "User" u LEFT JOIN (SELECT * FROM "Chat" WHERE "senderId"=${userId} OR "receiverId"=${userId} ) c ON u.id=c."senderId" OR u.id=c."receiverId") as uid WHERE id NOT IN (${excludeIds.join(',')}) GROUP BY id ) "chatInfo" LEFT JOIN "User" u ON "chatInfo"."userId"= id ORDER BY "online" DESC, "chatInfo"."latestChatAt" DESC NULLS LAST, "chatInfo"."loginTimes" DESC ) u OFFSET ${offset} LIMIT ${limit}`);
    return usersInfo;
};

export const getChatedUserList = async (userId: number, offset: number = 0, limit: number = 10, exclude = '') => {
    const excludeIds = [userId, ...(exclude ? exclude.split(',') : [])];
    // tslint:disable-next-line:max-line-length
    const [usersInfo] = await sequelize.query(`SELECT * FROM  (SELECT * FROM (SELECT * FROM (SELECT id as "userId", MAX("loginTimes") "loginTimes", MAX("updatedAt") "latestChatAt", COUNT(id) "chatCount" FROM (SELECT u.id, u."loginTimes", c."updatedAt" FROM "User" u LEFT JOIN (SELECT * FROM "Chat" WHERE ("senderId"=${userId} OR "receiverId"=${userId})) c ON u.id=c."senderId" OR u.id=c."receiverId") as uid WHERE id NOT IN (${excludeIds.join(',')})  GROUP BY id ) c WHERE "latestChatAt" IS NOT NULL ) c LEFT JOIN "User" u ON  u.id = c."userId") u ORDER BY "latestChatAt" DESC OFFSET ${offset} LIMIT ${limit}`);
    return usersInfo;
};
