
import * as express from 'express';
import Server, { errorWrapper } from '../server';

const router = express.Router()
  .post('', errorWrapper(async (req, res) => {
    res.json(req)
  }))

Server.use('/api/bot', router);
