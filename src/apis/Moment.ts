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

const router = Router()
    .post('/create', Upload.array('images', 9), errorWrapper(async (req: Request, res: Response) => {
        const ip = getClientIp(req);
        const moment = await new Moment({
            userId: req.session.user.id,
            content: '<p>' + req.body.content.replace(/\r\n/g, '<br\/>').replace(/\n/g, '<br\/>') + '<\/p>',
            disapproves: [],
            approves: [],
            ip,
        }).save();
        await saveUploadFiles(req.files, moment.id);
        res.json(new Result(moment));
    }))
    .get('/', errorWrapper(async (req: Request, res: Response) => {
        const { limit, offset, order } = parseQuery(req.query);
        const moments: Moment[] = await Moment.findAll({
            include: [
                Archive,
                User,
            ],
            offset,
            limit,
            order,
        });
        const momentJsons = await Promise.all(moments.map(async (moment) => {
            const momentJson = moment.toJSON();
            momentJson.images = momentJson.images.map((image) => image.id);
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
            return res.status(403).json(new Error('参数错误'));
        }
        if (!content) {
            return res.status(403).json(new Error('请输入修改过的内容'));
        }
        const moment = await Moment.update({ id }, { where: { content } });
        return res.json(new Result(moment));
    }))
    .put('/approve/:momentId', errorWrapper(async (req: Request, res: Response) => {
        const user = req.session.user;
        const moment = await Moment.findById(req.param('momentId'));
        if (!moment.approves) {
            moment.approves = [];
        }
        if (!moment.disapproves) {
            moment.disapproves = [];
        }
        const foundUser = moment.approves.find((approve) => {
            return approve === user.id;
        });
        if (foundUser) {
            moment.approves.splice(moment.approves.indexOf(user.id), 1);
        } else {
            moment.approves.push(user.id);
        }
        if (moment.disapproves.indexOf(user.id) >= 0) {
            moment.disapproves.splice(moment.disapproves.indexOf(user.id), 1);
        }
        // This is required, otherwise the data would not be stored.
        moment.approves = [...moment.approves];
        moment.disapproves = [...moment.disapproves];
        await moment.save();
        res.json(new Result(moment));
    }))
    .put('/disapprove/:momentId', errorWrapper(async (req: Request, res: Response) => {
        const user = req.session.user;
        const moment = await Moment.findById(req.param('momentId'));
        if (!moment.approves) {
            moment.approves = [];
        }
        if (!moment.disapproves) {
            moment.disapproves = [];
        }
        const foundUser = moment.disapproves.find((approve) => {
            return approve === user.id;
        });
        if (foundUser) {
            moment.disapproves.splice(moment.disapproves.indexOf(user.id), 1);
        } else {
            moment.disapproves.push(user.id);
        }
        if (moment.approves.indexOf(user.id) >= 0) {
            moment.approves.splice(moment.approves.indexOf(user.id), 1);
        }
        // This is required, otherwise the data would not be stored.
        moment.approves = [...moment.approves];
        moment.disapproves = [...moment.disapproves];
        await moment.save();
        res.json(new Result(moment));
    }));

app.use('/api/moment', router);
