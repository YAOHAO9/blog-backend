import { Request } from 'express';
declare module "express" {
    interface Request {
        session: any
    }
}