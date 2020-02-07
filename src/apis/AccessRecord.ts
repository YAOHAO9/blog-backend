import { Request, Response, Router } from 'express';

import app from '../services/AppService';
import AccessRecord from '../models/AccessRecord.model';
import { getClientIp, getLocationByIp, getRequest, getFullRequestUrl } from '../services/RequestService';
import { errorWrapper } from '../middlewares/server';
import * as markdownIt from 'markdown-it';
import { pug, path } from '../utils/Tool';
const markdown = markdownIt();

const router = Router()
    .post('/create', errorWrapper(async (req: Request, res: Response) => {
        const date = new Date(new Date().toDateString());
        if (req.session.user.isAdmin) {
            return res.json();
        }
        let ip;
        try {
            ip = await getLocationByIp(getClientIp(req));
        } catch (e) {
            //
        }

        await new AccessRecord(
            Object.assign(
                req.body,
                {
                    userId: req.session.user.id,
                    ip,
                    location: await getLocationByIp(ip),
                    date,
                    params: JSON.stringify(req.body.params),
                },
            ));
        // .save();
        return res.end();
    }))
    .get('/format', errorWrapper(async (req: Request, res: Response) => {
        const results = await getRequest(getFullRequestUrl(req).replace('/format', ''));
        const markdownStr = `${'```javascript\n'}${JSON.stringify(results, null, 4)}${'\n```'}`;
        const content = `<div class="markdown">${markdown.render(markdownStr)}</div>`;
        const html = pug.renderFile(path.join(__dirname, '../../assets/templates/MarkdownArticle.pug'),
            { content });
        res.send(html);
    }));

app.use('/api/accessrecord', router);
