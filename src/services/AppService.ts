import * as express from 'express';
import { http } from '../utils/Tool';

export { express };
const app = express();
export default app;

export const server = http.createServer(app);

export const asyncError = (handler) => {
    // tslint:disable-next-line:only-arrow-functions
    return function() {
        const args = arguments;
        handler(...args).catch((e) => {
            console.error(e.stack);
        });
    };
};
