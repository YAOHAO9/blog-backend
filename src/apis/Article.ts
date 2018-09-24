import parseImgSrc from '../services/ParseImgSrc';
import { Request, Response, Router } from 'express';
import app from '../services/AppService';
import { Result } from '../interfaces/Respond';
import Article from '../models/Article.model';
import ArticleContent from '../models/ArticleContent.model';
import User from '../models/User.model';
import Discussion from '../models/Discussion.model';

import { bgImgUrl, getArticleAndSaveByUrl } from '../services/ArticleService';
import Upload, { saveUploadFile } from '../services/UploadService';
import { errorWrapper } from '../middlewares/server';
import { parseQuery, pug, path } from '../utils/Tool';
import { sendMailToAdmin } from '../services/EmailService';

const router = Router()
    .post('/create', Upload.single('icon'), errorWrapper(async (req: Request, res: Response) => {
        if (!req.body.title) {
            return res.status(403).send(new Result(new Error('Title is required')));
        }
        if (!req.body.description) {
            return res.status(403).send(new Result(new Error('Description is required')));
        }
        if (!req.body.content) {
            return res.status(403).send(new Result(new Error('Content is required')));
        }
        let [content] = await parseImgSrc(req.body.content);
        content = await bgImgUrl(content);
        const article = await new Article({
            userId: (await User.findOne({ where: { isAdmin: true } })).id,
            title: req.body.title,
            description: req.body.description,
            icon: (await saveUploadFile(req.file)).id,
        }).save();
        await new ArticleContent({ content, articleId: article.id }).save();
        res.json(new Result(article));
        return await sendMailToAdmin(req.session.user, `${req.session.user.name} create an article`, content);
    }))
    .get('/', errorWrapper(async (req: Request, res: Response) => {
        const { limit, offset, order } = parseQuery(req.query);
        const articles: Article[] = await Article.findAll({
            include: [
                Discussion,
                User,
            ],
            offset,
            limit,
            order,
        });
        return res.json(new Result(articles));
    }))
    .get('/segmentFaultNote', errorWrapper(async (req: Request, res: Response) => {
        const articleType = 'segmentFaultNote';
        await Article.destroy({ where: { type: articleType } });
        await ArticleContent.destroy({ where: { articleId: null } });
        const articles = await getArticleAndSaveByUrl('https://segmentfault.com/u/yaohao/notes',
            `sf_remember=${req.query.sf_remember}`, '#codeMirror', articleType);
        res.json(new Result(articles));
    }))
    .get('/segmentFaultArticle', errorWrapper(async (req: Request, res: Response) => {
        const articleType = 'segmentFaultArticle';
        await Article.destroy({ where: { type: articleType } });
        const articles = await getArticleAndSaveByUrl('https://segmentfault.com/u/yaohao/articles',
            `sf_remember=${req.query.sf_remember}`, '#myEditor', articleType);
        res.json(new Result(articles));
    }))
    .get('/:id', errorWrapper(async (req: Request, res: Response) => {
        const article: Article = await Article.findById(req.param('id'), {
            include: [
                ArticleContent,
            ], limit: 10,
        });
        return res.json(new Result(article));
    }))
    .get('/detailHtml/:id', errorWrapper(async (req: Request, res: Response) => {
        const article: Article = await Article.findById(req.param('id'), {
            include: [
                ArticleContent,
            ], limit: 10,
        });
        const html = pug.renderFile(path.join(__dirname, '../../assets/templates/MarkdownArticle.pug'),
            { content: article.content.content });
        res.send(html);
    }));

app.use('/api/article', router);
