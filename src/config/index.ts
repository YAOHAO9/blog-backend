import { SequelizeOptions } from 'sequelize-typescript/lib/sequelize/types/SequelizeOptions';
import { path } from '../utils/Tool';
import { ClientOpts } from 'redis';

export const uploadFolderName = 'UploadsOfBlogBackend';
export interface ConfigInterface {
    sequelize: SequelizeOptions;
    redis: ClientOpts;
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
    smtpSettings: {
        auth: {
            pass: string,
            user: string,
        },
        sendmailFrom: string,
        secureConnection: boolean, // use SSL
        port: number, // port
        service: string,

    };
}

let Config: ConfigInterface = {
    sequelize: {
        database: 'mobileblog',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: true,
        },
        username: 'root',
        password: '123',
        modelPaths: [__dirname + '/../models'],
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
    smtpSettings: {
        auth: {
            pass: 'rltpkgykqlqxbfaf',
            user: '986403268@qq.com',
        },
        sendmailFrom: '<986403268@qq.com>',
        secureConnection: true, // use SSL
        port: 465, // port
        service: 'qq',
    },
};
Config = Object.assign(Config, {});
export default Config;
