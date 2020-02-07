import { Request, Response, Router } from 'express';

import app from '../services/AppService';
import Upload, { saveUploadFiles } from '../services/UploadService';
import { getClientIp } from '../services/RequestService';
import Moment from '../models/Moment.model';
import { Result } from '../interfaces/Respond';
import isAdmin from '../middlewares/Admin';
import Archive from '../models/Archive.model';
import { errorWrapper } from '../middlewares/server';
import { parseQuery } from '../utils/Tool';
import User from '../models/User.model';
import Discussion from '../models/Discussion.model';
import { sendMailToAdmin, sendImgMailToAdmin } from '../services/EmailService';
import MomentApproveService from '../services/MomentApproveService';
import MomentApprove from '../models/MomentApprove.model';

const router = Router()
    .post('/create', Upload.array('images', 9), errorWrapper(async (req: Request, res: Response) => {
        const ip = getClientIp(req);
        const { content } = req.body;
        if (!content && req.files.length === 0) {
            res.status(403).json(new Result(new Error('Content or image is required')));
            return;
        }
        const moment = await new Moment({
            userId: req.session.user.id,
            content: '<p>' + content.replace(/\r\n/g, '<br\/>').replace(/\n/g, '<br\/>') + '<\/p>',
            ip,
        }).save();
        const archives = await saveUploadFiles(req.files, moment.id);
        res.json(new Result(moment));
        await sendImgMailToAdmin(req.session.user,
            `${req.session.user.name} create a moment`, `${content}`,
            archives);
    }))
    .get('/', errorWrapper(async (req: Request, res: Response) => {
        const { limit, offset, order } = parseQuery(req.query);
        const moments: Moment[] = await Moment.findAll({
            include: [
                Archive,
                User,
                Discussion,
            ],
            offset: +offset,
            limit: +limit,
            order,
        });
        const momentJsons = await Promise.all(moments.map(async (moment) => {
            const momentJson = moment.toJSON();
            momentJson.images = momentJson.images.map((image) => image.id);
            momentJson.approves = await MomentApproveService.getApproves(momentJson.id);
            momentJson.disapproves = await MomentApproveService.getDisApproves(momentJson.id);
            return momentJson;
        }));
        return res.json(new Result(momentJsons));
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
            return res.status(403).json(new Error('Bad request'));
        }
        if (!content) {
            return res.status(403).json(new Error('Bad request'));
        }
        const moment = await Moment.update({ id }, { where: { content }, returning: true });
        return res.json(new Result(moment));
    }))
    .put('/approve/:momentId', errorWrapper(async (req: Request, res: Response) => {
        const momentId = +req.param('momentId');
        const userId = req.session.user.id;
        const status = req.body.action;

        await MomentApprove.destroy({
            where: {
                userId,
                momentId,
            },
        });

        if (status !== 0) {
            await MomentApprove.create({
                userId,
                momentId,
                status,
            });
        }

        res.json(new Result(status));
        await sendMailToAdmin(req.session.user,
            `${req.session.user.name} likes the moment:${momentId}`, `UserId: ${req.session.user.id}`);
    }));

app.use('/api/moment', router);
