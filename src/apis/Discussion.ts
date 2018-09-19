
import { Request, Router, Response } from 'express';
import app from '../services/AppService';
import { Result } from '../interfaces/Respond';
import { errorWrapper } from '../middlewares/server';
import Discussion from '../models/Discussion.model';
import User from '../models/User.model';
import { sendMailToAdmin } from '../services/EmailService';

const router = Router()
    .get('/moment/:momentId', errorWrapper(async (req: Request, res: Response) => {
        const discussions = await Discussion.findAll({
            where: { momentId: req.param('momentId') },
            include: [User],
            order: [['createdAt', 'DESC']],
        });
        res.json(new Result(discussions));
    }))
    .post('/moment/:momentId', errorWrapper(async (req: Request, res: Response) => {
        const discussion = await new Discussion({
            userId: req.session.user.id,
            momentId: +req.param('momentId'),
            content: '<p>' + req.body.content.replace(/\r\n/g, '<br\/>').replace(/\n/g, '<br\/>') + '<\/p>',
        }).save();
        res.json(new Result(discussion));
        await sendMailToAdmin(req.session.user,
            `${req.session.user.name} post a moment discussion(${discussion.momentId}): `, discussion.content);
    }))
    .get('/article/:articleId', errorWrapper(async (req: Request, res: Response) => {
        const discussions = await Discussion.findAll({
            where: { articleId: req.param('articleId') },
            include: [User],
            order: [['createdAt', 'DESC']],
        });
        res.json(new Result(discussions));
    }))
    .post('/article/:articleId', errorWrapper(async (req: Request, res: Response) => {
        const discussion = await new Discussion({
            userId: req.session.user.id,
            articleId: +req.param('articleId'),
            content: '<p>' + req.body.content.replace(/\r\n/g, '<br\/>').replace(/\n/g, '<br\/>') + '<\/p>',
        }).save();
        res.json(new Result(discussion));
        await sendMailToAdmin(req.session.user,
            `${req.session.user.name} post an article discussion(${discussion.articleId})`, discussion.content);
    }));

app.use('/api/discussion', router);
