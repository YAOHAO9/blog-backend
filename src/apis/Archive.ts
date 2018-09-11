
import { Request, Router, Response } from 'express';
import Server from '../server';
import { Result } from '../interfaces/Respond';
import { errorWrapper } from '../middlewares/server';
import Archive from '../models/Archive.model';
import { fs } from '../utils/Tool';

const router = Router()
    .get('/:id', errorWrapper(async (req: Request, res) => {
        const file = await Archive.findById(req.param('id'));
        if (!file) {
            return res.status(404).json(new Result(new Error('Not found.')));
        }
        return fs.createReadStream(file.path).pipe(res);
    }))
    .post('/create', (_, res: Response) => {
        res.jsonp({ aaa: 111 });
    });

Server.use('/api/archive', router);
