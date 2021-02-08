import { getArticle } from '../services/ArticleService';
import { fs } from './Tool';

const get = async () => {
    try {
        let cookie = process.argv[2] || `_ga=GA1.2.272576391.1612803169; _gid=GA1.2.1020303640.1612803169; __gads=ID=3fa5333d1a6506a3-220507b5f9c50075:T=1612803166:RT=1612803166:S=ALNI_MaLL8GKnwzGvRvYwqJE-lOMXcUCrw; Hm_lvt_e23800c454aa573c0ccb16b52665ac26=1612197509,1612203236,1612285171,1612800500; csrfToken=MbJxIJN3EIDdboVZJpWfgTp-; PHPSESSID=k8s~73cb0f39f07d1e9050872d2b38babed0; Hm_lpvt_e23800c454aa573c0ccb16b52665ac26=1612803229`
        const results = await getArticle('https://segmentfault.com/u/yaohao/notes',
            cookie,
            '#codeMirror');

        results.forEach((result) => {
            fs.writeFileSync(`notes/${result.title}.md`, result.data);
        });

    } catch (e) {
        console.error(e);
    }

};

get();
