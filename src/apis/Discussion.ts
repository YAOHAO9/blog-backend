
import { Request, Router, Response } from 'express';
import app from '../services/AppService';
import { Result } from '../interfaces/Respond';
import { errorWrapper } from '../middlewares/server';
import Discussion from '../models/Discussion.model';
import User from '../models/User.model';

const router = Router()
    .get('/:id', errorWrapper(async (req: Request, res: Response) => {
        const discussion = await Discussion.findById(req.param('id'), {
            include: [User],
        });
        res.json(new Result(discussion));
    }))
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
    }));

app.use('/api/discussion', router);
