import { SequelizeOptions } from 'sequelize-typescript/lib/sequelize/types/SequelizeOptions';
import { path } from '../utils/Tool';
import { SocketIORedisOptions } from 'socket.io-redis';

export const uploadFolderName = 'UploadsOfBlogBackend';
export interface ConfigInterface {
    sequelize: SequelizeOptions;
    redis: SocketIORedisOptions;
    Crytpo: {
        cipher: {
            algorithm: string;
            key: string; // 32位
            vector: string // 16位
        },
        hash: {
            algorithm: string;
        },
    };
    uploadPath: string;
}

let Config: ConfigInterface = {
    sequelize: {
        database: 'mobileblog',
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            charset: 'utf8',
            dialectOptions: {
                collate: 'utf8_general_ci',
            },
            timestamps: true,
        },
        username: 'postgres',
        password: '',
        modelPaths: [__dirname + '/../models/*.model.ts'],
    },
    redis: {
        host: 'localhost',
        port: 6379,
    },
    Crytpo: {
        cipher: {
            algorithm: 'aes-256-cbc',
            key: 'stiitbfrlbtdvotv9rjynecodhedygde',
            vector: 'keceoduyjyfyjdyy',
        },
        hash: {
            algorithm: 'sha256',
        },

    },
    uploadPath: path.join(__dirname, '../../../' + uploadFolderName),
};
Config = Object.assign(Config, {});
export default Config;
