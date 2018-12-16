import Config from '../config';
import * as nodemailer from 'nodemailer';
import { promisify } from 'bluebird';
import User from '../models/User.model';
import Archive from '../models/Archive.model';
import { path, pug } from '../utils/Tool';
import { encrypt } from '../utils/Crypto';

const transporter = nodemailer.createTransport(Config.smtpSettings);

export const sendMail = async (to: string, subject: string, html: string) => {

    if (process.env.NODE_ENV !== 'production') {
        return;
    }
    const mailOptions = {
        from: Config.smtpSettings.sendmailFrom, // sender address
        to, // list of receivers
        subject,
        html,
    };
    const sendMail = promisify<any, any>(transporter.sendMail, { context: transporter });
    const info = await sendMail(mailOptions);
    return info;
};

export const sendMailToAdmin = async (user: User, subject: string, content: string) => {
    return sendImgMailToAdmin(user, subject, content);
};

export const sendImgMailToAdmin = async (user: User, subject: string, content: string,
                                         archives: Archive[] = []) => {
    if (user.isAdmin) {
        return;
    }
    // notice admin
    const admin = await User.findOne({ where: { isAdmin: true, email: { $ne: null } } });
    if (!admin) {
        return;
    }
    const encrypted = encrypt(admin.id + '');
    // tslint:disable-next-line:max-line-length
    const accessOrigin = `${user.accessOrigin}/api/web/changeLoginUser?encrypted=${encrypted}&redirect=${user.accessOrigin}`;

    content = content.replace(/<\/?.*?>/gi, '');
    const images = archives.map((archive) => `${user.accessOrigin}/api/archive/${archive.id}`);
    const accessRecordsUrl = `${user.accessOrigin}/api/accessrecord/format?userId=${user.id}&sort=-createdAt`;
    const html = pug.renderFile(path.join(__dirname, '../../assets/templates/EmailNotice.pug'),
        { subject, content, images, accessOrigin, accessRecordsUrl });

    return sendMail(admin.email, subject, html);
};
