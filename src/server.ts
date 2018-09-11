import * as express from 'express';
import * as bluebird from 'bluebird';
import * as redis from 'redis';
import { http } from './utils/Tool';
import Config from './config';

const app = express();

export default app;

export const server = http.createServer(app);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export const redisClient = redis.createClient(Config.redis);
redisClient.on('error', (e) => {
  console.log('Error ' + e);
});
