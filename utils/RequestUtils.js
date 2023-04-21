import { getLogger } from './LoggerUtils.js';
import util from 'util'

const logger = getLogger('ResponseLog');
const INTERNAL_ERROR = 20000;

export function normalResultHandler(result, res, req, log=true) {
    if (log){
        var retStr = JSON.stringify(result);
        logger.info("request: %s =====> result: %s", req.path, retStr);
    }else{
        logger.info("request: %s =====> result: %s", req.path);
    }
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    return res.json(result);
};

export function errorHandler(errorObj, res, req) {
    var code = INTERNAL_ERROR;
    var error = '';
    if (errorObj && typeof errorObj == "object" && errorObj.errcode) {
        code = errorObj.errcode;
        error = errorObj.error;
    }
    else {
        error = errorObj;
    }
    var errmsg = errorObj.errmsg ? errorObj.errmsg : errorObj.message ? errorObj.message : error;
    if (typeof errmsg != 'string') {
        errmsg = JSON.stringify(errmsg);
    }

    var ret = {
        ret: -1,
        error,
        errcode: code,
        errmsg: errmsg
    };
    logger.error(
        "request: %s =====> failed: %s",
        req.path,
        JSON.stringify(ret),
        util.inspect(errorObj)
    );
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    return res.json(ret);
};

export function getClientIP(req) {
    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
};

