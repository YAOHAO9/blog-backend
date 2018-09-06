import * as http from 'http';

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
