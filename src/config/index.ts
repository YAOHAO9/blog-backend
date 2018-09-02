export interface ConfigInterface {
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
