import { Request, Response, Router } from 'express';

import Server from '../server';
import AccessRecord from '../models/AccessRecord.model';
import { getClientIp } from '../services/RequestService';
import { errorWrapper } from '../middlewares/server';

const router = Router()
    .post('create', errorWrapper(async (req: Request, res: Response) => {
        const date = new Date(new Date().toDateString());
        if (req.session.user.isAdmin) {
            return res.json();
        }
        const accessRecord = new AccessRecord(Object.assign(req.body,
            { user: req.session.user, ip: getClientIp(req), date })).save();
        return res.json(accessRecord);
    }));

Server.use('/api/access-record', router);
