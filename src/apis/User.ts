
import { Request, Router, Response } from 'express';
import app from '../server';
import { Result } from '../interfaces/Respond';
import { errorWrapper } from '../middlewares/server';

const router = Router()
    .get('/whoami', errorWrapper(async (req: Request, res) => {
        res.json(new Result(req.session.user));
    }))
    .post('/create', (_, res: Response) => {
        res.jsonp({ aaa: 111 });
    });

app.use('/api/user', router);
