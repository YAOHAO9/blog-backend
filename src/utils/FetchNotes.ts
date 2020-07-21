
import { getArticle } from '../services/ArticleService';
import { fs } from './Tool';

const get = async () => {
    try {
        const results = await getArticle('https://segmentfault.com/u/yaohao/notes',
            `sf_remember=069e8497383ca373f079aa587eb67f8a`, '#codeMirror');

        results.forEach((result) => {
            fs.writeFileSync(`notes/${result.title}.md`, result.data);
        });

    } catch (e) {
        console.error(e);
    }

};

get();
