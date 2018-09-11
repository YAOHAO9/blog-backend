import parseImgSrc from '../services/ParseImgSrc';
import { Request, Response, Router } from 'express';
import app from '../server';
import { Result } from '../interfaces/Respond';
import Article, { ArticleMethod } from '../models/Article.model';
import ArticleContent from '../models/ArticleContent.model';
import User from '../models/User.model';
import Discussion from '../models/Discussion.model';

import { bgImgUrl, getArticleAndSaveByUrl } from '../services/ArticleService';
import Upload, { saveUploadFile } from '../services/UploadService';
import { errorWrapper } from '../middlewares/server';
import { parseQuery } from '../utils/Tool';

const router = Router()
    .post('/create', Upload.single('icon'), errorWrapper(async (req: Request, res: Response) => {
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
            userId: (await User.findOne({ where: { isAdmin: true } })).id,
            title: req.body.title,
            description: req.body.description,
            icon: (await saveUploadFile(req.file)).id,
        }).save();
        await new ArticleContent({ content, articleId: article.id }).save();
        return res.json(new Result(article));
    }))
    .get('/', errorWrapper(async (req: Request, res: Response) => {
        const { limit, offset, order } = parseQuery(req.query);
        const articles: Article[] = await Article.findAll({
            include: [
                Discussion,
            ],
            offset,
            limit,
            order,
        });
        const articleJsons = await Promise.all(articles.map(async (article) => {
            const articleJson = article.toJSON();
            articleJson.user = await (article as ArticleMethod).getUser();
            articleJson.disapproves = await (article as ArticleMethod).getDisapproves();
            articleJson.approves = await (article as ArticleMethod).getApproves();
            return articleJson;
        }));
        return res.json(new Result(articleJsons));
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
    }));

app.use('/api/article', router);
