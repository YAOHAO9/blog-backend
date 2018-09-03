import parseImgSrc from '../services/ParseImgSrc';
import * as express from 'express';
import Server, { errorWrapper } from '../server';
import { Result } from '../interfaces/Respond';
import Article, { ArticleMethod } from '../models/Article.model';
import ArticleContent from '../models/ArticleContent.model';
import User from '../models/User.model';
import Discussion from '../models/Discussion.model';

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
        const articleContent = await new ArticleContent({ content }).save();
        const article = await new Article({
            userId: (await User.findOne({ where: { isAdmin: true } })).id,
            title: req.body.title,
            description: req.body.description,
            content: articleContent,
            icon: saveUploadFile(req.file),
        }).save();
        articleContent.articleId = article.id;
        await articleContent.save();
        return res.json(new Result(article));
    }))
    .get('/', errorWrapper(async (_: express.Request, res: express.Response) => {
        const articles: Article = await Article.find({
            include: [
                ArticleContent,
                Discussion,
            ], limit: 10,
        });
        const articleJson = articles.toJSON();
        articleJson.user = await (articles as ArticleMethod).getUser();
        articleJson.disapproves = await (articles as ArticleMethod).getDisapproves();
        articleJson.approves = await (articles as ArticleMethod).getApproves();
        return res.json(new Result(articleJson));
    }))
    .get('/:id', errorWrapper(async (req: express.Request, res: express.Response) => {
        const article: Article = await Article.findById(req.param('id'), {
            include: [
                ArticleContent,
            ], limit: 10,
        });
        const articleJson = article.toJSON();
        articleJson.user = await (article as ArticleMethod).getUser();
        articleJson.disapproves = await (article as ArticleMethod).getDisapproves();
        articleJson.approves = await (article as ArticleMethod).getApproves();
        return res.json(new Result(articleJson));
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
