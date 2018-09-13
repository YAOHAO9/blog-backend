
import { Request, Router, Response } from 'express';
import app from '../services/AppService';
import { Result } from '../interfaces/Respond';
import { errorWrapper } from '../middlewares/server';
import Upload, { saveUploadFile } from '../services/UploadService';
import User from '../models/User.model';
import { parseQuery } from '../utils/Tool';

const router = Router()
    .get('/whoami', errorWrapper(async (req: Request, res: Response) => {
        res.json(new Result(req.session.user));
    }))
    .get('/getOtherUser', errorWrapper(async (req: Request, res: Response) => {
        const { limit, offset, order } = parseQuery(req.query);
        const users = await User.findAll({
            where: { id: { $notIn: req.body.exclude } },
            limit,
            offset,
            order,
        });
        res.json(new Result(users));
    }))
    .post('/update/:id', Upload.single('avator'), async (req: Request, res: Response) => {
        res.jsonp({ aaa: 111 });
        const archive = await saveUploadFile(req.file);
        const [, users] = await User.update({ name: req.body.name, avator: archive && archive.id },
            { where: { id: req.param('id') }, returning: true });
        res.json(new Result(users[0]));
    });

app.use('/api/user', router);
