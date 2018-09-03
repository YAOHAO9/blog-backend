import * as cheerio from 'cheerio';
import * as superagent from 'superagent';
import * as markdownIt from 'markdown-it';
import * as path from 'path';
import * as fs from 'fs';
import parseImgSrc from './ParseImgSrc';
import Archive from '../models/Archive.model';
import Article from '../models/Article.model';
import ArticleContent from '../models/ArticleContent.model';

import { hash } from '../utils/Crypto';

const markdown = markdownIt();

const getHtmlByUrl = (url, cookie) => {
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
    return new Date(date.replace('年', '-').replace('月', '-').replace('日', ''));
};

export const getArticleAndSaveByUrl = async (url, cookie, textAreaId) => {
    const html = await getHtmlByUrl(url, cookie);
    const $ = cheerio.load(html);
    const list = $('body > div.profile > div > div > div > div.col-md-10.profile-mine > ul > li');
    const notePromises = (Array(list.length).fill(0)).map(async (_, index) => {
        const item = cheerio.load(list[index]);
        const title = item('div > div.profile-mine__content--title-warp > a')[0].firstChild.data;
        const createdAt: Date = formatDate(
            item('div > div.col-md-2 > span.profile-mine__content--date')[0].firstChild.data);
        const note = item('div > div.profile-mine__content--title-warp > a')[0];
        const url = 'https://segmentfault.com' + note.attribs.href.split('?')[0] + '/edit';
        const html = await getHtmlByUrl(url, cookie);
        const $ = cheerio.load(html);
        const data = markdown.render($(textAreaId)[0].firstChild.data.replace(/$/mg, '  '));
        const origin = 'https://segmentfault.com';
        // tslint:disable-next-line:prefer-const
        let [newHtml, fileIds] = await parseImgSrc(data, origin);
        newHtml = `<div class="markdown">${newHtml}</div>`;
        return new ArticleContent({ content: newHtml }).save()
            .then((content: ArticleContent) => {
                return new Article({
                    userId: 1,
                    title,
                    content,
                    createdAt,
                    icon: fileIds[0] ? fileIds[0] : null,
                }).save();
            });
    });
    return Promise.all(notePromises);
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
            const fileFd = path.join('.tmp', 'uploads', hash(url));
            const writeStream = fs.createWriteStream(fileFd);
            superagent(url).pipe(writeStream);
            writeStream.on('finish', () => {
                resolve(fileFd);
            });
            writeStream.on('error', (err) => {
                reject(err);
            });
        })
            .then(async (fileFd) => {
                const file = await new Archive({
                    fd: fileFd,
                    type: 'image/jpeg',
                    filename: url,
                    size: 0,
                }).save();
                content = content.replace(url, 'api/file/find/' + file.id);
            });
    });
    await Promise.all(tasks);
    return content;
};