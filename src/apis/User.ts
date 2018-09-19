
import { Request, Router, Response } from 'express';
import app from '../services/AppService';
import { Result } from '../interfaces/Respond';
import { errorWrapper } from '../middlewares/server';
import Upload, { saveUploadFile } from '../services/UploadService';
import User from '../models/User.model';
import { parseQuery } from '../utils/Tool';
import { getChatUserList } from '../services/ChatService';
import * as QRCode from 'qrcode';
import { promisify } from 'bluebird';
import { decrypt, encrypt } from '../utils/Crypto';
import { io } from '../services/SocketService';

const router = Router()
    .get('/whoami', errorWrapper(async (req: Request, res: Response) => {
        res.json(new Result(req.session.user));
    }))
    .get('/getChatUserList', errorWrapper(async (req: Request, res: Response) => {
        const { offset, limit } = parseQuery(req.query);
        const users = await getChatUserList(req.session.user.id, offset, limit, req.query.exclude);
        res.json(new Result(users));
    }))
    .post('/update/:id', Upload.single('avator'), async (req: Request, res: Response) => {
        const archive = req.file && await saveUploadFile(req.file);
        const [, users] = await User.update({ name: req.body.name, avator: archive && archive.id },
            { where: { id: req.param('id') }, returning: true });
        res.json(new Result(users[0]));
    })
    .get('/qrcode', errorWrapper(async (req: Request, res: Response) => {
        if (!req.query.origin) {
            return res.status(403).json(new Result(new Error('Bad request.')));
        }
        const toDataURL = promisify<string, string>(QRCode.toDataURL, { context: QRCode });
        const url = `${req.query.origin}/api/user/qrcodeLogin?encrypted=${
            req.cookies.encrypted
            }&origin=${req.query.origin}&socketId=${req.cookies.io}`;
        const imgBase64 = await toDataURL(url);
        return res.json(new Result(imgBase64));
    }))
    .get('/qrcodeLogin', errorWrapper(async (req: Request, res: Response) => {
        if (!req.query.origin || !req.query.encrypted) {
            res.status(403).json(new Result(new Error('Bad request.')));
            return;
        }
        if (!req.cookies.encrypted || req.query.encrypted === req.cookies.encrypted) {
            const tenYears = 10 * 365 * 24 * 60 * 60 * 1000;
            res.cookie('encrypted', req.query.encrypted, { maxAge: tenYears, httpOnly: true });
            res.redirect(req.query.origin);
            return;
        }

        res.redirect(`${req.query.origin}/#!/synchronize?encrypted=${
            req.query.encrypted
            }&socketId=${req.query.socketId}`);
    }))
    .get('/redirect', errorWrapper(async (req: Request, res: Response) => {
        if (!req.query.redirect) {
            return res.status(403).json(new Result(new Error('Bad request.')));
        }
        const userId = decrypt(req.query.encrypted);
        const user = await User.findById(+userId);
        if (!user) {
            res.status(403).json(new Result(new Error('Bad request.')));
            return;
        }
        const tenYears = 10 * 365 * 24 * 60 * 60 * 1000;
        const key = encrypt(user.id + '');
        res.cookie('encrypted', key, { maxAge: tenYears, httpOnly: true });
        return res.redirect(req.query.redirect);
    }))
    .get('/synchronizeToPc', errorWrapper(async (req: Request, res: Response) => {
        const encryptedOfPhone = req.cookies.encrypted;
        const socketIdOfPc = req.query.socketId;
        if (!socketIdOfPc) {
            res.status(403).json(new Result(new Error('Bad request')));
        }
        io.in(socketIdOfPc).emit('synchronize', { encrypted: encryptedOfPhone });
        res.end();
    }));

app.use('/api/user', router);
