
import * as finale from 'finale-rest';

import app from './AppService';
import User from '../models/User.model';
import AccessRecord from '../models/AccessRecord.model';
import Archive from '../models/Archive.model';
import Article from '../models/Article.model';
import Chat from '../models/Chat.model';
import Discussion from '../models/Discussion.model';
import Moment from '../models/Moment.model';
import { sequelize } from './SequelizeService';

const initializeRestfulApi = () => {
    finale.initialize({
        app,
        base: '/api',
        sequelize,
    });
    finale.resource({
        model: AccessRecord,
        endpoints: ['/accessrecord', '/accessrecord/:id'],
    });
    finale.resource({
        model: Archive,
        endpoints: ['/archive', '/archive/:id'],
    });
    finale.resource({
        model: Article,
        endpoints: ['/article', '/article/:id'],
    });
    finale.resource({
        model: Chat,
        endpoints: ['/chat', '/chat/:id'],
    });
    finale.resource({
        model: Discussion,
        endpoints: ['/comment', '/comment/:id'],
    });
    finale.resource({
        model: Moment,
        endpoints: ['/moment', '/moment/:id'],
    });
    finale.resource({
        model: User,
        endpoints: ['/user', '/user/:id'],
    });
};

export default initializeRestfulApi;
