import * as cheerio from 'cheerio';
import * as superagent from 'superagent';
import * as path from 'path';
import * as fs from 'fs';
import { hash } from '../utils/Crypto';
import Archive from '../models/Archive.model';
import Config from '../config';

const parseImgSrc = async (content: string, baseHttp: string = null) => {
    const $ = cheerio.load(content);
    const imgs = $('img');
    const tasks = [];
    // tslint:disable-next-line:prefer-for-of It is not a real Array.
    for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        let src = img.attribs.src;
        if (src.indexOf('http') < 0) {
            if (baseHttp && src.indexOf('/') !== -1) {
                src = baseHttp + src;
            } else {
                continue;
            }
        }
        const task = new Promise<string>(async (resolve, reject) => {
            try {
                const filePath = path.join(Config.uploadPath, hash(src));
                const writeStream = fs.createWriteStream(filePath);
                superagent(src).pipe(writeStream);
                writeStream.on('finish', () => {
                    resolve(filePath);
                });
                writeStream.on('error', (e) => {
                    reject(e);
                });
            } catch (e) {
                reject(e);
            }
        })
            .then(async (filePath) => {
                let archive = await Archive.findOne({ where: { path: filePath } });
                if (!archive) {
                    archive = await new Archive({
                        path: filePath,
                        mimetype: 'image/jpeg',
                        destination: Config.uploadPath,
                        filename: src,
                        size: 0,
                    }).save();
                }
                $(img).attr('src', 'api/archive/' + archive.id);
                return archive.id;
            });
        tasks.push(task);
    }
    const fileIds = await Promise.all(tasks);
    return [$.html(), fileIds];
};
export default parseImgSrc;
