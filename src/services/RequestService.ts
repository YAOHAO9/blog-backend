import Axios, { AxiosRequestConfig } from 'axios';
import { Request } from 'express';
export const getClientIp = (req) => {
    // console.log('req.headers[\'x-forwarded-for\']:' + req.headers && req.headers['x-forwarded-for']);
    // console.log('req.connection.remoteAddress:' + req.connection && req.connection.remoteAddress);
    // console.log('req.socket.remoteAddress:' + req.socket && req.socket.remoteAddress);
    // console.log('req.connection.socket.remoteAddress:'
    //     + req.connection && req.connection.socket && req.connection.socket.remoteAddress);
    const ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(':');
    return ip[ip.length - 1];
};

export const getLocationByIp = async (ip: string) => {
    const ips = ip.split(',');
    const tasks = ips.map(async (ip) => {
        ip = ip.trim();
        if (ip === '') {
            return '';
        }
        const result = await getRequest(`http://ip.360.cn/IPShare/info?ip=${ip}`);
        return result.location;
    });
    const locations = await Promise.all(tasks);
    return locations.join(',');
};

export const getRequest = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await Axios.get(url, config);
    return response.data;
};

export const putRequest = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await Axios.put(url, data, config);
    return response.data;
};

export const postRequest = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await Axios.post(url, data, config);
    return response.data;
};

export const getFullRequestUrl = (req: Request) => {
    return `${req.protocol}://${req.headers.host}${req.originalUrl}`;
};
