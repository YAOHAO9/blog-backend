
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
    .get('/redirect', errorWrapper(async (req: Request, res: Response) => {
        if (!req.query.redirect) {
            return res.status(403).json(new Result(new Error('Bad request.')));
        }
        return res.redirect(req.query.redirect);
    }))
    .get('/qrcode', errorWrapper(async (req: Request, res: Response) => {
        if (!req.query.origin) {
            return res.status(403).json(new Result(new Error('Bad request.')));
        }
        const toDataURL = promisify<string, string>(QRCode.toDataURL, { context: QRCode });
        const url = `${req.query.origin}/api/user/redirect?encrypted=${
            req.cookies.encrypted
            }&redirect=${req.query.origin}`;
        console.log(url);
        const imgBase64 = await toDataURL(url);
        return res.json(new Result(imgBase64));
    }));

app.use('/api/user', router);
