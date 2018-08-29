import * as crypto from 'crypto';
import Config from '../config';
export default crypto;

const cipherConfig = Config.Crytpo.cipher

export const encrypt = (source: string) => {
    let dest = '';
    const cipher = crypto.createCipheriv(cipherConfig.algorithm, cipherConfig.key, new Buffer(cipherConfig.vector));
    dest += cipher.update(source, 'utf8', 'hex');
    dest += cipher.final('hex');
    return dest;
}

export const decrypt = (dest: string) => {
    let source = '';
    const decipher = crypto.createDecipheriv(cipherConfig.algorithm, cipherConfig.key, new Buffer(cipherConfig.vector));
    source += decipher.update(dest, 'hex', 'utf8');
    source += decipher.final('utf8');
    return source;
}

export const hash = (source: string) => {
    return crypto.createHash(Config.Crytpo.hash.algorithm).update(source, 'utf8').digest('hex')
}