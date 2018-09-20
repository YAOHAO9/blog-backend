
import { Request, Router } from 'express';
import app, { asyncError } from '../services/AppService';
import { Result } from '../interfaces/Respond';
import Upload, { saveUploadFile } from '../services/UploadService';
import Chat from '../models/Chat.model';
import { errorWrapper } from '../middlewares/server';
import { parseQuery, associateInstances } from '../utils/Tool';
import { io } from '../services/SocketService';
import { sendImgMailToAdmin } from '../services/EmailService';
import { redisClient } from '../services/RedisService';

const router = Router()
    .post('/sendImage', Upload.single('image'), errorWrapper(async (req: Request, res) => {
        const file = await saveUploadFile(req.file);
        let chat;
        const { session, receiverId } = req.body;
        if (!file) {
            res.status(403).json(new Result(new Error('Please select an image.')));
            return;
        }
        const data = {
            type: 'image',
            img: file.id,
            senderId: req.session.user.id,
            session,
            receiverId: session === '0-0' ? undefined : receiverId,
        };
        chat = await new Chat(data).save();
        res.json(new Result(chat));

        setImmediate(asyncError(async () => {
            const chatJSON = await associateInstances(chat, 'Sender', 'Receiver');

            if (chat.session === '0-0') {
                io.in('0-0').emit('update', chatJSON);
                await sendImgMailToAdmin(req.session.user,
                    `Group chat: ${chatJSON.sender.name}`,
                    `imageId: ${chatJSON.img}`, [file]);
                return;
            } else {
                await sendImgMailToAdmin(req.session.user,
                    `Chat: ${chatJSON.sender.name} =》 ${chatJSON.receiver.name}`,
                    `imageId: ${chatJSON.img}`, [file]);
                const senderSocketIds = await redisClient.smembersAsync(chatJSON.sender.id);
                senderSocketIds.forEach((socketId) => {
                    io.in(socketId).emit('update', chatJSON);
                });
                const receiverSocketIds = await redisClient.smembersAsync(chatJSON.receiver.id);
                receiverSocketIds.forEach((socketId) => {
                    io.in(socketId).emit('update', chatJSON);
                });
                return;
            }
        }));
    }))
    .get('/find', errorWrapper(async (req: Request, res) => {
        const { offset, limit, order } = parseQuery(req.query);
        if (!req.query.session) {
            return res.status(403).json(new Result(new Error('Bad request.')));
        }
        const chats = await Chat.findAll({ offset, limit, order, where: { session: req.query.session } });
        chats.reverse();
        return res.json(new Result(await associateInstances(chats, 'Sender', 'Receiver')));
    }))
    .put('/read', errorWrapper(async (req: Request, res) => {
        const [, chats] = await Chat.update({ read: true }, { where: { id: req.body.chatId }, returning: true });
        res.json(chats && chats.length === 1 && new Result(chats[0]));
    }))
    .get('/allUnreadMsgCount', errorWrapper(async (req: Request, res) => {
        const allUnreadMsgCount = await Chat.count({
            where: {
                read: false, receiverId: req.session.user.id,
            },
        });
        res.json(new Result(allUnreadMsgCount));
    }));

app.use('/api/chat', router);
