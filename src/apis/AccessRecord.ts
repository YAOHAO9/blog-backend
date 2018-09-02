import { Request, Response, Router } from 'express';

import Server, { errorWrapper } from '../server';
import AccessRecord from '../models/AccessRecord.model';
import { getClientIp } from '../services/RequestService';
const router = Router()
    .post('create', errorWrapper(async (req: Request, res: Response) => {
        const date = new Date(new Date().toDateString());
        if (req.session.user.isAdmin) {
            return res.json();
        }
        AccessRecord.create(Object.assign(req.body, { user: req.session.user, ip: getClientIp(req), date }))
            .then((accessRecord) => {
                res.json(accessRecord);
            })
            .catch((e) => {
                console.log(e);
            });

        return null;
    }));

Server.use('/api/bot', router);
