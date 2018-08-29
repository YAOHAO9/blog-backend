
import * as express from 'express';
import Server, { errorWrapper } from '../server';

const router = express.Router()
  .get('/whoami', errorWrapper(async (req: express.Request, res) => {
    res.json(req.session.user)
  }))

Server.use('/api/user', router);
