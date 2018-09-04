import * as cheerio from 'cheerio';
import * as superagent from 'superagent';
import * as path from 'path';
import * as fs from 'fs';
import { hash } from '../utils/Crypto';
import Archive from '../models/Archive.model';

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
                const folderPath = path.join('.tmp', 'uploads');
                if (fs.existsSync(folderPath)) {
                    console.log('exist');
                }
                const fileFd = path.join('.tmp', 'uploads', hash(src));
                const writeStream = fs.createWriteStream(fileFd);
                superagent(src).pipe(writeStream);
                writeStream.on('finish', () => {
                    resolve(fileFd);
                });
                writeStream.on('error', (e) => {
                    reject(e);
                });
            } catch (e) {
                reject(e);
            }
        })
            .then(async (fileFd) => {
                const file = await new Archive({
                    fd: fileFd,
                    type: 'image/jpeg',
                    filename: src,
                    size: 0,
                }).save();
                $(img).attr('src', 'api/archive/' + file.id);
                return file.id;
            });
        tasks.push(task);
    }
    const fileIds = await Promise.all(tasks);
    return [$.html(), fileIds];
};
export default parseImgSrc;
