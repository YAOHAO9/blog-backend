import * as multer from 'multer';
import Archive from '../models/Archive.model';
import crypto from '../utils/Crypto';
import Config from '../config';
import { fs, path } from '../utils/Tool';
import { RequestHandler } from 'express';

export interface UploadInterface {
    array: (names: string, num?: number) => RequestHandler;
    single: (name: string) => RequestHandler;
}
const Upload: UploadInterface = multer({ dest: Config.uploadPath });
export default Upload;

const readFileHash = (filePath) => {
    return new Promise<string>((reslove) => {
        const hash = crypto.createHash(Config.Crytpo.hash.algorithm);
        const stream = fs.createReadStream(filePath);
        stream.on('data', (chunk) => {
            hash.update(chunk);
        });
        stream.on('end', () => {
            reslove(hash.digest('hex'));
        });
    });
};
export const saveUploadFile = async (file: any, momentId?: number): Promise<Archive> => {
    file.momentId = momentId;
    const fileHash = await readFileHash(file.path);
    file.filename = fileHash;
    const newPath = path.join(file.destination, fileHash);
    fs.renameSync(file.path, newPath);
    file.path = fileHash;
    return new Archive(file).save();
};

export const saveUploadFiles = (files: any[], momentId?: number): Promise<Archive[]> => {
    const tasks = files.map((file) => {
        return saveUploadFile(file, momentId);
    });
    return Promise.all(tasks);
};
