import * as cheerio from 'cheerio';
import * as superagent from 'superagent';
import * as markdownIt from 'markdown-it';
import parseImgSrc from './ParseImgSrc';
import Archive from '../models/Archive.model';
import Article from '../models/Article.model';
import ArticleContent from '../models/ArticleContent.model';

import { hash } from '../utils/Crypto';
import User from '../models/User.model';
import Config from '../config';
import { path, fs } from '../utils/Tool';

const markdown = markdownIt();

const fetchHtmlByUrl = (url, cookie) => {
    return new Promise((resolve, reject) => {
        superagent
            .get(url)
            // tslint:disable-next-line:max-line-length
            .set('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36')
            .set('cookie', cookie)
            .end((e, res) => {
                if (e) {
                    return reject(e);
                }
                resolve(res.text);
            });
    });
};

const formatDate = (date) => {
    if (date.indexOf('年') === -1) {
        date = `${(new Date()).getFullYear()}年${date}`;
    }
    const newDate = new Date(date.replace('年', '-').replace('月', '-').replace('日', ''));
    if ((newDate + '') === 'Invalid Date') {
        return new Date();
    }
    return newDate;
};
/**
 * @param url 文章列表页Url
 * @param cookie cookie
 * @param textAreaId markdown所在的<textarea>
 * @param articleType 类型：文章或者笔记
 */
export const getArticleAndSaveByUrl = async (url, cookie, textAreaId, articleType) => {
    // 获取html
    const notes = await getArticle(url, cookie, textAreaId);

    return notes.map(async ({ title, createdAt, data }) => {
        // 解析文章中的图片并下载
        // tslint:disable-next-line:prefer-const
        let [newHtml, fileIds] = await parseImgSrc(markdown.render(data), 'https://segmentfault.com');
        // 替换掉无用的标签
        newHtml = `<div class="markdown">${newHtml.replace(/<\/?(html|head|body)>/g, '')}</div>`;
        // 保存文章
        const article = await new Article({
            userId: (await User.findOne({ where: { isAdmin: true } })).id,
            title,
            createdAt,
            icon: fileIds[0] ? fileIds[0] : null,
            type: articleType,
        }).save();
        // 保存文章内容详情
        const articleContent = await new ArticleContent({ content: newHtml, articleId: article.id }).save();
        article.content = articleContent;
        return article;
    });
};

export const bgImgUrl = async (content: string) => {
    let urls = content.match(/url\([^\)]*\)/g);
    if (!urls) { urls = []; }
    urls = urls.map((url) => {
        return url
            .replace('url(', '')
            .replace(')', '')
            .replace(/&quot;/g, '');
    });
    const tasks = urls.map((url) => {
        if (url.indexOf('http') < 0) { return null; }
        return new Promise<string>((resolve, reject) => {
            const fileFd = path.join('.tmp', hash(url));
            const writeStream = fs.createWriteStream(fileFd);
            superagent(url).pipe(writeStream);
            writeStream.on('finish', () => {
                resolve(fileFd);
            });
            writeStream.on('error', (err) => {
                reject(err);
            });
        })
            .then(async (filePath) => {
                const file = await new Archive({
                    path: filePath,
                    mimetype: 'image/jpeg',
                    destination: Config.uploadPath,
                    filename: url,
                    size: 0,
                }).save();
                content = content.replace(url, '/api/archive/' + file.id);
            });
    });
    await Promise.all(tasks);
    return content;
};

export const getArticle = async (url: any, cookie: any, textAreaId: any) => {
    let page = 1;

    const notePromises: Array<Promise<{
        title: any;
        createdAt: Date;
        data: any;
    }>> = [];

    while (true) {
        const html = await fetchHtmlByUrl(`${url}?page=${page}`, cookie);
        // cheerio加载html
        const $ = cheerio.load(html);
        // 获取文章列表ul
        const list = $('body > div.profile > div > div > div > div.col-md-10.profile-mine > ul > li');
        // 解析所有文章或者笔记
        const tasks = (Array(list.length).fill(0)).map(async (_, index) => {
            // 获取每个li
            const item = cheerio.load(list[index]);
            // 获取标题
            const title = item('div > div.profile-mine__content--title-warp > a')[0].firstChild.data;
            // 解析创建时间
            const createdAt: Date = formatDate(
                item('div > div.col-md-2 > span.profile-mine__content--date')[0].firstChild.data);
            // 获取文章id所在的<a>标签
            const note = item('div > div.profile-mine__content--title-warp > a')[0];
            // 获取编辑状态链接
            const url = 'https://segmentfault.com' + note.attribs.href.split('?')[0] + '/edit';
            // 获取编辑状态下的网页
            const html = await fetchHtmlByUrl(url, cookie);
            // cheerio加载html
            const $ = cheerio.load(html);

            const data = $(textAreaId)[0].firstChild.data.replace(/$/mg, '  ');

            return { title, createdAt, data };
        });
        if (tasks.length === 0) {
            break;
        }
        page++;
        notePromises.push(...tasks);
    }

    return Promise.all(notePromises);

};
