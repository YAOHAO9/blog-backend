import Config from '../config';
import * as nodemailer from 'nodemailer';
import { promisify } from 'bluebird';
import User from '../models/User.model';
import * as pug from 'pug';
import Archive from '../models/Archive.model';
import { path } from '../utils/Tool';

const transporter = nodemailer.createTransport(Config.smtpSettings);

export const sendMail = async (to: string, subject: string, content: string,
                               images: string[] = [], origin?: string) => {

    if (process.env.NODE_ENV !== 'production') {
        return;
    }
    if (!origin) {
        images = [];
    }

    const html = pug.renderFile(path.join(__dirname, '../../assets/templates/EmailNotice.pug'),
        { subject, content, images });
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

export const sendMailToAdmin = async (user: User, subject: string, content: string,
) => {
    if (user.isAdmin) {
        return;
    }
    // notice admin
    const admin = await User.findOne({ where: { isAdmin: true, email: { $ne: null } } });
    if (!admin) {
        return;
    }
    return sendMail(admin.email, subject, content);
};

export const sendImgMailToAdmin = async (user: User, subject: string, content: string,
                                         archives: Archive[], origin?: string) => {
    if (user.isAdmin) {
        return;
    }
    // notice admin
    const admin = await User.findOne({ where: { isAdmin: true, email: { $ne: null } } });
    if (!admin) {
        return;
    }
    const images = archives.map((archive) => `${origin}/api/archive/${archive.id}`);
    return sendMail(admin.email, subject, content, images, origin);
};
