
import * as express from 'express';
import Server, { errorWrapper } from '../server';
import { Result } from '../interfaces/Respond';

const router = express.Router()
  .get('/whoami', errorWrapper(async (req: express.Request, res) => {
    res.json(new Result(req.session.user));
  }))
  .post('/create', (_, res: express.Response) => {
    res.jsonp({ aaa: 111 });
  });

Server.use('/api/moment', router);
