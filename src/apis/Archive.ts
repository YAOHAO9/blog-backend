
import { Request, Router, Response } from 'express';
import app from '../services/AppService';
import { Result } from '../interfaces/Respond';
import { errorWrapper } from '../middlewares/server';
import Archive from '../models/Archive.model';
import { fs, path } from '../utils/Tool';

const router = Router()
    .get('/:id', errorWrapper(async (req: Request, res) => {
        const file = await Archive.findById(req.param('id'));
        if (!file) {
            return res.status(404).json(new Result(new Error('Not found.')));
        }
        return fs.createReadStream(path.resolve(file.path)).pipe(res);
    }))
    .post('/create', (_, res: Response) => {
        res.jsonp({ aaa: 111 });
    });

app.use('/api/archive', router);
