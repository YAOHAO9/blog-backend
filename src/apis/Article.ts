import parseImgSrc from '../services/ParseImgSrc';
import * as express from 'express';
import Server, { errorWrapper } from '../server';
import { Result } from '../interfaces/Respond';
import Article from '../models/Article.model';
import ArticleContent from '../models/ArticleContent.model';
import User from '../models/User.model';
import Comment from '../models/Comment.model';

import { bgImgUrl, getArticleAndSaveByUrl } from '../services/ArticleService';
import upload, { saveUploadFile } from '../services/UploadService';

const router = express.Router()
    .post('/create', upload.single('icon'), errorWrapper(async (req: express.Request, res: express.Response) => {
        if (!req.body.title) {
            return res.status(403).send(new Result(new Error('标题不能为空')));
        }
        if (!req.body.description) {
            return res.status(403).send(new Result(new Error('无有效内容')));
        }
        if (!req.body.content) {
            return res.status(403).send(new Result(new Error('内容不能为空')));
        }
        let [content] = await parseImgSrc(req.body.content);
        content = await bgImgUrl(content);
        const article = await new Article({
            userId: 1,
            title: req.body.title,
            description: req.body.description,
            content: await new ArticleContent({ content }).save(),
            icon: saveUploadFile(req.file),
        });
        return res.json(new Result(article));
    }))
    .get('/', errorWrapper(async (_: express.Request, res: express.Response) => {
        const articles = await Article.find({ include: [User, ArticleContent, Comment], limit: 10 });
        return res.json(new Result(articles));
    }))
    .get('/:id', errorWrapper(async (req: express.Request, res: express.Response) => {
        const article = await Article.findById(req.param('id'),
            { include: [User, ArticleContent, Comment] });
        return res.json(new Result(article));
    }))
    .get('segmentFaultNote', errorWrapper(async (req: express.Request, res: express.Response) => {
        const articles = await getArticleAndSaveByUrl('https://segmentfault.com/u/yaohao/notes',
            `sf_remember=${req.query.sf_remember}`, '#codeMirror');
        res.json(new Result(articles));
    }))
    .get('segmentFaultArticle', errorWrapper(async (req: express.Request, res: express.Response) => {
        const articles = await getArticleAndSaveByUrl('https://segmentfault.com/u/yaohao/articles',
            `sf_remember=${req.query.sf_remember}`, '#myEditor');
        res.json(new Result(articles));
    }));

Server.use('/api/article', router);
