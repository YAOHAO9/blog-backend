
import { Request, Response, NextFunction } from 'express';
import User from '../models/User.model';
import { encrypt, decrypt } from '../utils/Crypto';
import { getRandomName } from '../config/famousNames';
import { errorWrapper } from './server';

const loadSession = errorWrapper(async (req: Request, res: Response, next: NextFunction) => {
    let user: User;
    const encrypted = req.cookies.encrypted;
    if (encrypted) {
        try {
            const userId = decrypt(encrypted);
            user = await User.findById(+userId);
        } catch (e) { console.log(e.message); }
    }
    if (!user) {
        user = await new User({ name: getRandomName() }).save();
    }
    const tenYears = 10 * 365 * 24 * 60 * 60 * 1000;
    const key = encrypt(user.id + '');
    res.cookie('encrypted', key, { maxAge: tenYears, httpOnly: true });
    req.session = { user };
    next();
});

export default loadSession;
