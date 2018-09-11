
import { Request, Router } from 'express';
import Server, { io } from '../server';
import { Result } from '../interfaces/Respond';
import Upload, { saveUploadFile } from '../services/UploadService';
import Chat from '../models/Chat.model';
import { errorWrapper } from '../middlewares/server';

const router = Router()
    .post('/sendImage', Upload.single('image'), errorWrapper(async (req: Request, res) => {
        const file = await saveUploadFile(req.file);
        let chat;
        if (file) {
            const data = Object.assign({}, req.body, { type: 'image', img: file.id });
            if (data.session === '0-0') {
                delete data.receiver;
            }
            delete data.content;
            chat = await new Chat(data).save();
        }
        res.json(new Result(chat));
        if (chat.session === '0-0') {
            return io.sockets.broadcast('0-0', 'update', chat.toJSON());
        }
        if (chat.receiver && chat.receiver.socketId) {
            io.sockets.broadcast(chat.receiver.socketId, 'update', chat.toJSON());
        }
    }))
    .get('/find', errorWrapper(async (req: Request, res) => {
        const { offset, count, sort } = req.query;
        const chats = Chat.find({ offset, limit: count || 3, order: sort, group: 'session' });
        res.json(new Result(chats));
    }))
    .get('/read', errorWrapper(async (req: Request, res) => {
        const [, chats] = await Chat.update({ read: true }, { where: { chatId: req.query.chatId } });
        res.json(chats && chats.length === 1 && new Result(chats[0]));
    }))
    .get('/getUnreadNum', errorWrapper(async (req: Request, res) => {
        const chats = Chat.find({
            where: {
                read: false, receiver: req.session.user.id, sender: req.body.sender,
            },
        });
        res.json(new Result(chats));
    }))
    .get('/allUnreadMsgNum', errorWrapper(async (req: Request, res) => {
        const chats = Chat.find({
            where: {
                read: false, receiver: req.session.user.id,
            },
        });
        res.json(new Result(chats));
    }));

Server.use('/api/chat', router);
