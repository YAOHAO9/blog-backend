

import * as finale from 'finale-rest';

import app, { sequelize } from './server';
import User from './models/User.model';
import AccessRecord from './models/AccessRecord.model';
import Archive from './models/Archive.model';
import Article from './models/Article.model';
import Chat from './models/Chat.model';
import Comment from './models/Comment.model';
import Moment from './models/Moment.model';

const initializeRestfulApi = () => {
    finale.initialize({
        app: app,
        base: '/api',
        sequelize: sequelize
    });
    finale.resource({
        model: AccessRecord,
        endpoints: ['/access-record', '/access-record/:id']
    });
    finale.resource({
        model: Archive,
        endpoints: ['/archive', '/archive/:id']
    });
    finale.resource({
        model: Article,
        endpoints: ['/article', '/article/:id']
    });
    finale.resource({
        model: Chat,
        endpoints: ['/chat', '/chat/:id']
    });
    finale.resource({
        model: Comment,
        endpoints: ['/comment', '/comment/:id']
    });
    finale.resource({
        model: Moment,
        endpoints: ['/moment', '/moment/:id']
    });
    finale.resource({
        model: User,
        endpoints: ['/user', '/user/:id']
    });
}

export default initializeRestfulApi;