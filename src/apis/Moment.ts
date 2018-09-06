import { Request, Response, Router } from 'express';

import Server, { errorWrapper } from '../server';
import Upload, { saveUploadFiles } from '../services/UploadService';
import { getClientIp } from '../services/RequestService';
import Moment from '../models/Moment.model';
import { Result } from '../interfaces/Respond';
import isAdmin from '../middlewares/Admin';
import MomentApprove from '../models/MomentApprove.model';

const router = Router()
    .post('/create', Upload.array('images', 9), errorWrapper(async (req: Request, res: Response) => {
        const ip = getClientIp(req);
        const moment = await new Moment({
            userId: req.session.user.id,
            content: '<p>' + req.body.content.replace(/\r\n/g, '<br\/>').replace(/\n/g, '<br\/>') + '<\/p>',
            ip,
        }).save();
        await saveUploadFiles(req.files, moment.id);
        res.json(new Result(moment));
    }))
    .delete('/:id', isAdmin, errorWrapper(async (req: Request, res: Response) => {
        const id = req.param('id');
        const moment = await Moment.destroy({ where: { id } });
        res.json(new Result(moment));
    }))
    .post('/edit', isAdmin, errorWrapper(async (req: Request, res: Response) => {
        const content = req.body.content;
        const id = req.body.id;
        if (!id) {
            return res.status(403).json(new Error('参数错误'));
        }
        if (!content) {
            return res.status(403).json(new Error('请输入修改过的内容'));
        }
        const moment = await Moment.update({ id }, { where: { content } });
        return res.json(new Result(moment));
    }))
    .post('/approve', errorWrapper(async (req: Request, res: Response) => {
        const { momentId, userId } = req.body;
        const momentApprove = await new MomentApprove({ momentId, userId }).save();
        res.json(new Result(momentApprove));
    }))
    .post('/disapprove', errorWrapper(async (req: Request, res: Response) => {
        const { momentId, userId } = req.body;
        const momentApprove = await MomentApprove.destroy({ where: { momentId, userId } });
        res.json(new Result(momentApprove));
    }));

Server.use('/api/moment', router);
