
import * as SocketIO from 'socket.io';
import * as socketRedis from 'socket.io-redis';
import { server, asyncError } from '../services/AppService';
import Config from '../config';
import Chat, { ChatType } from '../models/Chat.model';
import User from '../models/User.model';
import { associateInstances } from '../utils/Tool';
import { redisClient } from './RedisService';
import { sendMailToAdmin } from './EmailService';

const onJoinIn = (socket: SocketIO.Socket) => {
    socket.on('joinIn', asyncError(async (roomId) => {
        socket.join(roomId);
    }));
};

const onWhoami = (socket: SocketIO.Socket) => {
    socket.on('whoami', asyncError(async (data) => {
        const user = await User.findById(data.userId);
        user.accessOrigin = data.accessOrigin;
        user.loginTimes++;
        user.online = true;
        await user.save();
        await redisClient.setAsync(socket.id, user.id);
        await redisClient.saddAsync(user.id, socket.id);
        if (process.env.NODE_ENV !== 'production') {
            return;
        }
        await sendMailToAdmin(user, 'User login', `${user.name}，第${user.loginTimes}次上线!`);
    }));
};

const onSubmit = (socket: SocketIO.Socket) => {
    socket.on('submit', asyncError(async (chat) => {
        const chatInstance = await new Chat(Object.assign(chat, { type: ChatType.TEXT })).save();
        const chatJSON = await associateInstances(chatInstance, 'Sender', 'Receiver');
        if (chatJSON.session === '0-0') {
            io.in('0-0').emit('update', chatJSON);
            await sendMailToAdmin(chatJSON.sender,
                `Group chat: ${chatJSON.sender.name}`,
                `${chatJSON.content}`);
        } else {
            socket.emit('update', chatJSON);
            const senderSocketIds = await redisClient.smembersAsync(chatJSON.sender.id);
            senderSocketIds.forEach((socketId) => {
                if (socketId === socket.id) { return; }
                io.in(socketId).emit('update', chatJSON);
            });
            const receiverSocketIds = await redisClient.smembersAsync(chatJSON.receiver.id);
            receiverSocketIds.forEach((socketId) => {
                io.in(socketId).emit('update', chatJSON);
            });
            await sendMailToAdmin(chatJSON.sender,
                `Chat: ${chatJSON.sender.name} =》 ${chatJSON.receiver.name}`,
                `${chatJSON.content}`);
        }
    }));
};

const onDisconnect = (socket: SocketIO.Socket) => {
    // tslint:disable-next-line:only-arrow-functions
    socket.on('disconnect', async (/* reason */) => {
        const userId = await redisClient.getAsync(socket.id);
        await User.update({ online: false }, { where: { id: userId } });
        await redisClient.delAsync(socket.id);
        await redisClient.sremAsync(userId, socket.id);
    });
};

export const io = SocketIO(server);

export const initializeSocketIO = () => {
    io.adapter(socketRedis(Config.redis));
    io.on('connection', asyncError(async (socket) => {
        socket.join('0-0');
        onJoinIn(socket);
        onWhoami(socket);
        onSubmit(socket);
        onDisconnect(socket);
    }));
};
