import { Request } from 'express';
import User from '../models/User.model';
interface Session {
    user: User
}
declare module "express" {
    interface Request {
        session: Session,
        file: any,
        files: any,
    }
}