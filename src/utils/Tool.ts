import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

export { http, fs, path };
/**
 * 根据 ip 获取获取地址信息
 */
function getIpInfo(ip, cb) {
    const sina_server = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=';
    const url = sina_server + ip;
    http.get(url, (res) => {
        const code = res.statusCode;
        if (code === 200) {
            res.on('data', (data) => {
                try {
                    cb(null, JSON.parse(data + ''));
                } catch (err) {
                    cb(err);
                }
            });
        } else {
            cb({ code });
        }
    }).on('error', (e) => { cb(e); });
}

function getClientIp(req) {
    // console.log("req.headers['x-forwarded-for']:" + req.headers && req.headers['x-forwarded-for'])
    // console.log("req.connection.remoteAddress:" + req.connection && req.connection.remoteAddress)
    // console.log("req.socket.remoteAddress:" + req.socket && req.socket.remoteAddress)
    // console.log("req.connection.socket.remoteAddress:" +
    // req.connection && req.connection.socket && req.connection.socket.remoteAddress)
    const ip = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(':');
    return ip[ip.length - 1];
}

export const getUserCityInfo = (req) => {
    const ip = getClientIp(req);
    return new Promise((resolve, reject) => {
        getIpInfo(ip, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
};

export const parseQuery = ((query): { offset: number, limit: number, order: any } => {
    const { offset = 0, count = 10, sort } = query;
    const order = [];
    const columnNames = [];
    if (sort) {
        const sortColumns = sort.split(',');
        sortColumns.forEach((sortColumn) => {
            if (sortColumn.indexOf('-') === 0) {
                const actualName = sortColumn.substring(1);
                order.push([actualName, 'DESC']);
                columnNames.push(actualName);
            } else {
                columnNames.push(sortColumn);
                order.push([sortColumn, 'ASC']);
            }
        });
    }
    return { offset, limit: count, order: order.length ? order : undefined };
});

export const associateInstances = (instances: any, ...keys: string[]) => {
    let isArray = true;
    if (!(instances instanceof Array)) {
        instances = [instances];
        isArray = false;
    }
    const tasks = instances.map(async (instance) => {
        const newInstance = instance.toJSON();
        await Promise.all(
            keys.map(async (key) => {
                const lowerCaseKey = key.toLowerCase();
                const sander = await instance[`get${key}`]();
                return newInstance[lowerCaseKey] = sander;
            }));
        return newInstance;
    });
    if (isArray) {
        return Promise.all(tasks);
    }
    return tasks[0];
};
