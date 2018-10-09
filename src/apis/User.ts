
import { Request, Router, Response } from 'express';
import app from '../services/AppService';
import { Result } from '../interfaces/Respond';
import { errorWrapper } from '../middlewares/server';
import Upload, { saveUploadFile } from '../services/UploadService';
import User from '../models/User.model';
import { parseQuery } from '../utils/Tool';
import { getChatUserList, getChatedUserList } from '../services/ChatService';
import * as QRCode from 'qrcode';
import { promisify } from 'bluebird';
import { decrypt, encrypt } from '../utils/Crypto';
import { io } from '../services/SocketService';
import { getRandomName } from '../config/famousNames';
const tenYears = 10 * 365 * 24 * 60 * 60 * 1000;
const router = Router()
    .get('/whoami', errorWrapper(async (req: Request, res: Response) => {
        res.json(new Result(req.session.user));
    }))
    .get('/getChatUserList', errorWrapper(async (req: Request, res: Response) => {
        const { offset, limit } = parseQuery(req.query);
        const users = await getChatUserList(req.session.user.id, offset, limit, req.query.exclude);
        res.json(new Result(users));
    }))
    .get('/getChatedUserList', errorWrapper(async (req: Request, res: Response) => {
        const { offset, limit } = parseQuery(req.query);
        const users = await getChatedUserList(req.session.user.id, offset, limit, req.query.exclude);
        res.json(new Result(users));
    }))
    .post('/update/:id', Upload.single('avator'), async (req: Request, res: Response) => {
        const archive = req.file && await saveUploadFile(req.file);
        const [, users] = await User.update({ name: req.body.name, avator: archive && archive.id },
            { where: { id: req.param('id') }, returning: true });
        res.json(new Result(users[0]));
    })
    .get('/reset', errorWrapper(async (_: Request, res: Response) => {
        const user = await new User({ name: getRandomName() }).save();
        const encrypted = encrypt(user.id + '');
        res.cookie('encrypted', encrypted, { maxAge: tenYears, httpOnly: true });
        return res.redirect('/');
    }))
    .get('/qrcode', errorWrapper(async (req: Request, res: Response) => {
        if (!req.query.origin) {
            return res.status(403).json(new Result(new Error('Bad request.')));
        }
        const toDataURL = promisify<string, string>(QRCode.toDataURL, { context: QRCode });
        const url = `${req.query.origin}/api/web/qrcodeLogin?encrypted=${
            req.cookies.encrypted
            }&origin=${req.query.origin}&socketId=${req.cookies.io}`;
        const imgBase64 = await toDataURL(url);
        return res.json(new Result(imgBase64));
    }))
    .get('/synchronizeToPc', errorWrapper(async (req: Request, res: Response) => {
        const encryptedOfPhone = req.cookies.encrypted;
        const socketIdOfPc = req.query.socketId;
        if (!socketIdOfPc) {
            res.status(403).json(new Result(new Error('Bad request')));
        }
        io.in(socketIdOfPc).emit('synchronize', { encrypted: encryptedOfPhone });
        res.end();
    }))
    .get('/encryptedUser', errorWrapper(async (req: Request, res: Response) => {
        const userId = decrypt(req.query.encrypted);
        const user = await User.findById(+userId);
        if (!user) {
            res.status(403).json(new Result(new Error('Bad request.')));
            return;
        }
        res.json(new Result(user));
    }));

app.use('/api/user', router);
