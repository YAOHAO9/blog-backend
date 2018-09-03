import { SequelizeOptions } from 'sequelize-typescript/lib/sequelize/types/SequelizeOptions';

export interface ConfigInterface {
    sequelize: SequelizeOptions;
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
}

const Config: ConfigInterface = {
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
        modelPaths: [__dirname + '/../models'],
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
};

export default Object.assign(Config, {});
