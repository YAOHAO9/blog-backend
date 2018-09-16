
import * as SocketIO from 'socket.io';
import * as socketRedis from 'socket.io-redis';
import { server, asyncError } from '../services/AppService';
import Config from '../config';
import Chat from '../models/Chat.model';
import User from '../models/User.model';
import * as nodemailer from 'nodemailer';
import { associateInstances } from '../utils/Tool';
const transporter = nodemailer.createTransport(Config.smtpSettings);

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

        if (process.env.NODE_ENV !== 'production') {
            return;
        }
        if (user.isAdmin) {
            return;
        }
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
        const chatInstance = await new Chat(chat).save();
        const chatInstanceJSON = await associateInstances(chatInstance, 'Sender', 'Receiver');
        if (chatInstanceJSON.session === '0-0') {
            io.in('0-0').emit('update', chatInstanceJSON);
        } else {
            if (chatInstanceJSON.receiver.socketId) {
                io.in(chatInstanceJSON.receiver.socketId).emit('update', chatInstanceJSON);
            }
            socket.emit('update', chatInstanceJSON);
        }
    }));
};

const onDisconnect = (socket: SocketIO.Socket) => {
    // tslint:disable-next-line:only-arrow-functions
    socket.on('disconnect', async (/* reason */) => {
        await User.update({ socketId: null },
            { where: { socketId: socket.id }, returning: true });

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
