
import { Request, Router, Response } from 'express';
import app from '../services/AppService';
import { Result } from '../interfaces/Respond';
import { errorWrapper } from '../middlewares/server';
import { decrypt, encrypt } from '../utils/Crypto';
import User from '../models/User.model';
const tenYears = 10 * 365 * 24 * 60 * 60 * 1000;

const router = Router()
  .get('/qrcodeLogin', errorWrapper(async (req: Request, res: Response) => {
    if (!req.query.origin || !req.query.encrypted) {
      res.status(403).json(new Result(new Error('Bad request.')));
      return;
    }
    if (!req.cookies.encrypted || req.query.encrypted === req.cookies.encrypted) {
      res.cookie('encrypted', req.query.encrypted, { maxAge: tenYears, httpOnly: true });
      res.redirect(req.query.origin);
      return;
    }

    res.redirect(`${req.query.origin}/#!/synchronize?encrypted=${
      req.query.encrypted
      }&socketId=${req.query.socketId}`);
  }))
  .get('/changeLoginUser', errorWrapper(async (req: Request, res: Response) => {
    if (!req.query.redirect || !req.query.encrypted) {
      return res.status(403).json(new Result(new Error('Bad request.')));
    }
    const userId = decrypt(req.query.encrypted);
    const user = await User.findById(+userId);
    if (!user) {
      res.status(403).json(new Result(new Error('Bad request.')));
      return;
    }
    const encrypted = encrypt(user.id + '');
    res.cookie('encrypted', encrypted, { maxAge: tenYears, httpOnly: true });
    return res.redirect(req.query.redirect);
  }));

app.use('/api/web', router);
