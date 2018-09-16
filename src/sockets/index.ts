
import * as SocketIO from 'socket.io';
import * as socketRedis from 'socket.io-redis';
import { server, asyncError } from '../services/AppService';
import Config from '../config';
import Chat from '../models/Chat.model';
import User from '../models/User.model';
import * as nodemailer from 'nodemailer';
import { associateInstances } from '../utils/Tool';
const transporter = nodemailer.createTransport(Config.smtpSettings);

const onDisconnect = (socket: SocketIO.Socket) => {
    socket.on('disconnect', asyncError(async (/* reason */) => {
        await User.update({ socketId: null },
            { where: { socketId: socket.id }, returning: true });
    }));
};

const onJoinIn = (socket: SocketIO.Socket) => {
    socket.on('joinIn', asyncError(async (roomId) => {
        socket.join(roomId);
    }));
};

const onWhoami = (socket: SocketIO.Socket) => {
    socket.on('whoami', asyncError(async (userId) => {
        const user = await User.findById(userId);
        user.loginTimes++;
        user.socketId = socket.id;
        await user.save();
        socket.emit('whoami', user.toJSON());
        // notice admin
        const admin = await User.findOne({ where: { isAdmin: true, email: { $ne: null } } });
        if (!admin) {
            return;
        }
        const mailOptions = {
            from: Config.smtpSettings.sendmailFrom, // sender address
            to: admin.email, // list of receivers
            subject: 'YaoHao\'s Mibile Blog',
            html: '',
        };
        mailOptions.html = `${user.name}，第${user.loginTimes}次上线!`;
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }));
};

const onSubmit = (socket: SocketIO.Socket) => {
    socket.on('submit', asyncError(async (chat) => {
        socket.join(chat.session);

        const chatInstance = await new Chat(chat).save();
        const chatInstanceJSON = await associateInstances(chatInstance, 'Sender', 'Receiver');
        if (chatInstanceJSON.session === '0-0') {
            io.in('0-0').emit('update', chatInstanceJSON);
        } else {
            if (chatInstanceJSON.receiver.socketId) {
                io.sockets.connected[chatInstanceJSON.receiver.socketId].join(chat.session);
            }
            io.in(chat.session).emit('update', chatInstanceJSON);
        }
    }));
};
export const io = SocketIO(server);

export const initializeSocketIO = () => {
    io.adapter(socketRedis(Config.redis));
    io.on('connection', (socket) => {
        socket.join('0-0');
        onDisconnect(socket);
        onJoinIn(socket);
        onWhoami(socket);
        onSubmit(socket);
    });
};
