
import * as SocketIO from 'socket.io';
import * as socketRedis from 'socket.io-redis';
import { server, asyncError } from '../services/AppService';
import Config from '../config';
import Chat from '../models/Chat.model';
import User from '../models/User.model';
import * as nodemailer from 'nodemailer';
import { Sequelize } from 'sequelize-typescript';
import { associateInstances } from '../utils/Tool';
const transporter = nodemailer.createTransport(Config.smtpSettings);
const Op = Sequelize.Op;
export const io = SocketIO(server);
export const initializeSocketIO = () => {
    io.adapter(socketRedis(Config.redis));
    io.on('connection', (socket) => {
        socket.on('room', asyncError(async (roomId) => {
            socket.join(roomId);
        }));
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
        socket.join('0-0');
        /*listen*/
        socket.on('who', asyncError(async (id) => {
            /*Init sessions*/
            const sessions = await Chat.findAll({
                attributes: [
                    'session',
                    [Sequelize.fn('MAX', Sequelize.col('senderId')), 'senderId'],
                    [Sequelize.fn('MAX', Sequelize.col('receiverId')), 'receiverId'],
                ],
                where: {
                    [Op.or]: [
                        { senderId: id, session: { $ne: '0-0' } },
                        { receiverId: id, session: { $ne: '0-0' } },
                    ],
                },
                group: 'session',
                limit: 3,
                // order: ['createdAt', 'DESC'],
            });
            const tasks = sessions.map((session) => {
                const users = session.session.split('-');
                const receiver = users.find((user) => {
                    return user !== id;
                });
                return User.findById(receiver)
                    .then((receiver) => {
                        const newSession = session.toJSON();
                        newSession.sender = id;
                        newSession.name = receiver.name;
                        newSession.receiver = receiver.id;
                        newSession.list = [];
                        return newSession;
                    });
            });
            await Promise.all(tasks);
            socket.emit('initSessions', sessions);

            if (process.env.NODE_ENV !== 'development') {
                const [, results] = await User.update({ socketId: socket.id }, { where: { id }, returning: true });
                const admin = await User.find({ where: { isAdmin: true, email: { $ne: null } } });
                const user = results[0];
                user.loginTimes++;
                user.save();
                if (!results || results.length === 0 || !admin) {
                    return;
                }
                if (user.isAdmin || !admin.email) {
                    return;
                }
                // setup e-mail data with unicode symbols
                const mailOptions = {
                    from: Config.smtpSettings.sendmailFrom, // sender address
                    to: admin.email, // list of receivers
                    subject: 'YaoHao\'s Mibile Blog',
                    html: '',
                };
                mailOptions.html = `${user.name}，上线了！</br>
                ${JSON.stringify(user, null, 2)}`;

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
            }
        }));

        socket.on('find', asyncError(async (cond) => {
            cond = cond || {};
            const findCond = { session: cond.session };
            const chats = await Chat.find({
                where: findCond,
                offset: cond.skip,
                limit: cond.limit,
                // order: ['updatedAt', 'DESC'],
                // include: [User],
            });
            socket.emit('initSession', await associateInstances(chats, 'Sender', 'Receiver'));
        }));
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
    });
};
