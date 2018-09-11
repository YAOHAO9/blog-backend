import * as bluebird from 'bluebird';
import * as redis from 'redis';
import Config from '../config';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export const redisClient = redis.createClient(Config.redis);
redisClient.on('error', (e) => {
    console.log('Error ' + e);
});
