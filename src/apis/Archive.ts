
import { Request, Router, Response } from 'express';
import app from '../services/AppService';
import { Result } from '../interfaces/Respond';
import { errorWrapper } from '../middlewares/server';
import Archive from '../models/Archive.model';
import { fs, path } from '../utils/Tool';
import { promisify } from 'bluebird';
import * as QRCode from 'qrcode';
import Config from '../config';

const router = Router()
    .get('/customQrcode', errorWrapper(async (req: Request, res: Response) => {
        const toDataURL = promisify<string, string>(QRCode.toDataURL, { context: QRCode });
        const url = `${req.query.origin || ''}${req.query.url}`;
        const imgBase64 = await toDataURL(url);
        return res.json(new Result(imgBase64));
    }))
    .get('/:id', errorWrapper(async (req: Request, res) => {
        const file = await Archive.findById(req.param('id'));
        if (!file) {
            return res.status(404).json(new Result(new Error('Not found.')));
        }
        return fs.createReadStream(path.resolve(`${Config.uploadPath}/${file.path}`)).pipe(res);
    }));

app.use('/api/archive', router);
