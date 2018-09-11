import * as express from 'express';
import { http } from '../utils/Tool';

const app = express();
export default app;

export const server = http.createServer(app);
