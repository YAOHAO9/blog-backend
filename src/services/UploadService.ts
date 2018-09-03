import * as multer from 'multer';
const upload = multer({ dest: 'uploads/' });

export default upload;

export const saveUploadFile = (file: any): number => {
    console.log(JSON.stringify(file, null, 2));
    return 1;
};

export const saveUploadFiles = (files: any[]): number[] => {
    console.log(JSON.stringify(files, null, 2));
    return [];
};
