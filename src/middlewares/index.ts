import app from "../server";
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import loadSession from "./session";

export const initializeMiddlewares = () => {
    app.use(cookieParser())
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(loadSession)
}