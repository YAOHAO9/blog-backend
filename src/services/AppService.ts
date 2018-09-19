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

export interface AsyncError {
    asyncError<T, A1, A2, A3, A4, A5, A6, A7, A8, A9, A10>(
        func: (arg1?: A1, arg2?: A2, arg3?: A3, arg4?: A4, arg5?: A5,
               arg6?: A6, arg7?: A7, arg8?: A8, arg9?: A9, arg10?: A10) => T,
    ): (arg1?: A1, arg2?: A2, arg3?: A3, arg4?: A4, arg5?: A5,
        arg6?: A6, arg7?: A7, arg8?: A8, arg9?: A9, arg10?: A10) => T;
}
