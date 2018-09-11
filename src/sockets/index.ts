
import * as SocketIO from 'socket.io';
import * as socketRedis from 'socket.io-redis';
import { server } from '../services/AppService';
import Config from '../config';

export const io = SocketIO(server);
export const initializeSocketIO = () => {
    io.adapter(socketRedis(Config.redis));
    io.on('connection', (socket) => {
        console.log(socket.id);
    });
};
