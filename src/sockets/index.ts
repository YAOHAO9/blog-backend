
import * as SocketIO from 'socket.io';
import * as socketRedis from 'socket.io-redis';
import { server } from '../server';

export const io = SocketIO(server);
export const initializeSocketIO = () => {
    io.adapter(socketRedis({ host: 'localhost', port: 6379 }));
    io.on('connection', (socket) => {
        console.log(socket.id);
    });
};
